import { app } from "./app";
import { introspectSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor, observableToAsyncIterable } from "@graphql-tools/utils";
import { getOperationAST, OperationTypeNode, print } from "graphql";
import { createClient } from "graphql-ws";
import {
  getContext,
  IContextResult,
  setCookieContext,
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

const httpExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const { accessToken, refreshToken } = getContext(context);

    const query = print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
        ...(refreshToken
          ? {
              Cookie: `refreshToken=${refreshToken}`,
            }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
    const cookiesResponse = fetchResult.headers.get("set-cookie");
    const accessTokenHeader = fetchResult.headers.get("accessToken");
    if (cookiesResponse) {
      setCookieContext(context, cookiesResponse);
    }
    if (accessTokenHeader) {
      setTokenContext(context, accessTokenHeader);
    }
    return fetchResult.json();
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
  const courses = executorBoth(
    "http://backend-courses:4000/graphql",
    "ws://backend-courses:4000/graphql"
  );
  const auth = httpExecutor("http://backend-auth:4002/graphql");
  const gatewaySchema = stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(courses),
        executor: courses,
      },
      {
        schema: await introspectSchema(auth),
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
        const cookies = (result.context as IContextResult | undefined)?.cookies;
        const accessTokenHeader = (result.context as IContextResult | undefined)
          ?.accessTokenHeader;
        if (cookies) {
          res.setHeader("Set-Cookie", cookies);
        }
        if (accessTokenHeader) {
          res.setHeader("accessToken", accessTokenHeader);
        }
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
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
