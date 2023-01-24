import { app } from "./app";
import { schemaFromExecutor } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor, observableToAsyncIterable } from "@graphql-tools/utils";
import { getOperationAST, OperationTypeNode, print } from "graphql";
import { createClient } from "graphql-ws";
import {
  IContextResult,
  jwtMiddleware,
  setCookieContext,
  setExtensionsContext,
  setTokenContext,
} from "./utils";
import { useServer } from "graphql-ws/lib/use/ws";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import ws, { WebSocketServer, CloseEvent } from "ws";
import { nanoid } from "nanoid";

const httpExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const query = print(document);
    let accessToken: string = context?.req?.headers?.authorization ?? "";
    const refreshToken: string = context?.req?.cookies?.refreshToken ?? "";
    if (context?.req?.cookies?.refreshToken) {
      try {
        const response = await jwtMiddleware(refreshToken, accessToken);
        accessToken = response.getValidaccesstoken();
      } catch (e) {
        accessToken = "";
      }
    }
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: context?.req?.headers
        ? {
            ...(context?.req?.headers?.["x-forwarded-for"]
              ? {
                  "x-forwarded-for": context?.req?.headers?.["x-forwarded-for"],
                }
              : {}),
            authorization: accessToken,
            cookie: context?.req?.headers?.cookie,
            "content-type": context?.req?.headers?.["content-type"],
            "user-agent": context?.req?.headers?.["user-agent"],
          }
        : {
            "Content-Type": "application/json",
          },
      body: JSON.stringify({ query, variables }),
    });
    const cookiesResponse = fetchResult.headers.get("set-cookie") || "";
    const accessTokenHeader = fetchResult.headers.get("accessToken") || "";
    if (cookiesResponse) {
      setCookieContext(context, cookiesResponse);
    }
    if (accessTokenHeader) {
      setTokenContext(context, accessTokenHeader);
    }
    const result = await fetchResult.json();
    if (result?.extensions && context) {
      setExtensionsContext(context, result.extensions);
    }
    return result;
  };
};

const executorBoth =
  (url: string, streamUrl: string): AsyncExecutor =>
  async (args) => {
    const operation = getOperationAST(args.document, args.operationName);
    if (operation?.operation === OperationTypeNode.SUBSCRIPTION) {
      return wsExecutor(streamUrl)(args);
    }
    return httpExecutor(url)(args);
  };

const wsExecutor = (url: string): AsyncExecutor => {
  return async ({
    document,
    variables,
    operationName,
    extensions,
    context,
  }) => {
    const subscriptionClient = createClient({
      url,
      webSocketImpl: ws,
      connectionParams: () => {
        return {
          Authorization: (context?.Authorization as string | undefined) || "",
        };
      },
    });
    return observableToAsyncIterable({
      subscribe: (observer) => ({
        unsubscribe: subscriptionClient.subscribe(
          {
            query: print(document),
            variables: variables as Record<string, unknown>,
            operationName,
            extensions,
          },
          {
            next: (data) => {
              observer.next && observer.next(data as any);
            },
            error: (err) => {
              if (!observer.error) return;
              if (err instanceof Error) {
                observer.error(err);
              } else if ((err as CloseEvent)?.code) {
                observer.error(
                  new Error(
                    `Socket closed with event ${(err as CloseEvent).code}`
                  )
                );
              } else if (Array.isArray(err)) {
                observer.error(
                  new Error(err.map(({ message }) => message).join(", "))
                );
              }
            },
            complete: () => {
              observer.complete && observer.complete();
            },
          }
        ),
      }),
    });
  };
};

const makeGatewaySchema = async () => {
  const fintech = executorBoth(
    "http://backend-fintech:4000/graphql",
    "ws://backend-fintech:4000/graphql"
  );
  const auth = httpExecutor("http://backend-auth:4002/graphql");
  const gatewaySchema = stitchSchemas({
    subschemas: [
      {
        schema: await schemaFromExecutor(fintech),
        executor: fintech,
      },
      {
        schema: await schemaFromExecutor(auth),
        executor: auth,
      },
    ],
  });
  return gatewaySchema;
};

makeGatewaySchema().then((schema) => {
  app.use("/graphql", async (req, res) => {
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };
    const cookies = req.cookies;
    if (!cookies?.sessionId) {
      res.cookie("sessionId", nanoid());
    }
    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => ({ req }),
      });
      if (result.type === "RESPONSE") {
        const cookies =
          (result.context as IContextResult | undefined)?.cookies || "";
        const accessTokenHeader =
          (result.context as IContextResult | undefined)?.accessTokenHeader ||
          "";
        if (typeof cookies === "string") {
          res.setHeader("Set-Cookie", cookies);
        }
        if (typeof accessTokenHeader === "string") {
          res.setHeader("accessToken", accessTokenHeader);
        }
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        result.payload.extensions = (
          result.context as IContextResult | undefined
        )?.extensions;
        res.json(result.payload);
      }
    }
  });
  const server = app.listen(4001, () => {
    const wsServer = new WebSocketServer({
      server,
      path: "/graphql",
    });
    useServer(
      {
        schema,
        context: (ctx) => {
          return {
            Authorization:
              (ctx?.connectionParams?.Authorization as string | undefined) ||
              "",
          };
        },
      },
      wsServer
    );
  });
});
