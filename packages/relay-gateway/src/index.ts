import { app } from "./app";
import { schemaFromExecutor, wrapSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor, observableToAsyncIterable } from "@graphql-tools/utils";
import {
  ExecutionResult,
  getOperationAST,
  OperationTypeNode,
  parse,
  print,
} from "graphql";
import { createClient } from "graphql-ws";
import { IContextResult, jwtMiddleware, setExtensionsContext } from "./utils";
import { useServer } from "graphql-ws/lib/use/ws";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import ws, { Server as WebSocketServer, CloseEvent } from "ws";
import cookie from "cookie";
import { ObjMap } from "graphql/jsutils/ObjMap";
import { delegateToSchema } from "@graphql-tools/delegate";
import { fromGlobalId } from "graphql-relay";
import queryMap from "./queryMap.json";

const httpExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const query = print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: context?.req?.headers
        ? {
            "x-forwarded-for": context?.req?.socket?.remoteAddress,
            authorization: context?.req?.headers?.["authorization"],
            cookie: context?.req?.headers?.["cookie"],
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
      context?.res?.setHeader("Set-Cookie", cookiesResponse);
    }
    if (accessTokenHeader) {
      context?.res?.setHeader("accessToken", accessTokenHeader);
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
            next: (data: unknown) => {
              observer.next &&
                observer.next(data as ExecutionResult<null, unknown>);
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
  const auth = httpExecutor("http://backend-auth-node:4002/graphql");
  const schemaFintech = wrapSchema({
    schema: await schemaFromExecutor(fintech),
    executor: fintech,
  });
  const schemaAuth = wrapSchema({
    schema: await schemaFromExecutor(auth),
    executor: auth,
  });
  const gatewaySchema = stitchSchemas({
    subschemas: [schemaFintech, schemaAuth],
    resolvers: {
      Query: {
        node: {
          resolve(_, args, context, info) {
            const { type } = fromGlobalId(args.id);
            if (type === "AuthUser") {
              return delegateToSchema({
                schema: schemaAuth,
                operation: OperationTypeNode.QUERY,
                fieldName: "node",
                args,
                context,
                info,
              });
            } else {
              return delegateToSchema({
                schema: schemaFintech,
                operation: OperationTypeNode.QUERY,
                fieldName: "node",
                args,
                context,
                info,
              });
            }
          },
        },
      },
    },
  });
  return gatewaySchema;
};

makeGatewaySchema().then((schema) => {
  app.use("/graphql", async (req, res) => {
    const doc_id = req.body?.doc_id;
    const query = queryMap.find((query) => query[0] === doc_id);
    const request = {
      body: {
        ...req.body,
        ...(query
          ? {
              query: query?.[1],
            }
          : {}),
      },
      headers: req.headers,
      method: req.method,
      query: req.query,
    };
    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    } else {
      const refreshToken: string = req.cookies.refreshToken ?? "";
      if (req.cookies.refreshToken) {
        try {
          const response = await jwtMiddleware(
            refreshToken,
            req.headers.authorization ?? ""
          );
          const validAccessToken = response.getValidaccesstoken();
          req.headers.authorization = validAccessToken;
          res.setHeader("accessToken", validAccessToken);
          const id = response.getId();
          const isLender = response.getIslender();
          const isBorrower = response.getIsborrower();
          const isSupport = response.getIssupport();
          if (req?.headers?.cookie) {
            req.headers.cookie +=
              "; " +
              cookie.serialize("id", id, {
                httpOnly: true,
              });
            req.headers.cookie +=
              "; " +
              cookie.serialize("isLender", String(isLender), {
                httpOnly: true,
              });
            req.headers.cookie +=
              "; " +
              cookie.serialize("isBorrower", String(isBorrower), {
                httpOnly: true,
              });
            req.headers.cookie +=
              "; " +
              cookie.serialize("isSupport", String(isSupport), {
                httpOnly: true,
              });
          }
        } catch (e) {
          req.headers.authorization = "";
        }
      }
      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => ({ req, res }),
      });
      if (result.type === "RESPONSE") {
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        result.payload.extensions = (
          result.context as IContextResult | undefined
        )?.extensions as ObjMap<unknown> | undefined;
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
        onSubscribe: (_ctx, msg) => {
          const doc_id = msg.payload.extensions?.doc_id;
          if (typeof doc_id === "string") {
            const persistedQuery = queryMap.find(
              (query) => query[0] === doc_id
            );
            if (persistedQuery) {
              const args = {
                schema,
                operationName: msg.payload.operationName,
                document: parse(persistedQuery[1]),
                variableValues: msg.payload.variables,
              };
              return args;
            }
          }
          return;
        },
      },
      wsServer
    );
  });
});
