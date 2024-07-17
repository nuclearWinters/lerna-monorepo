import { schemaFromExecutor, wrapSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import { OperationTypeNode, parse, print } from "graphql";
import { parse as parseCookie } from "cookie";
import { jwtMiddleware } from "./utils";
import cookie from "cookie";
import { delegateToSchema } from "@graphql-tools/delegate";
import { fromGlobalId } from "graphql-relay";
import queryMap from "./queryMap.json";
import { createHandler } from "graphql-sse/lib/use/http2";
import { createSecureServer } from "http2";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import fs from "fs";
import { AsyncExecutor, observableToAsyncIterable } from "@graphql-tools/utils";
import { fetch } from "@whatwg-node/fetch";
import { createClient } from "graphql-sse";

//import { ex } from "@graphql-tools/executor"

const subscriptionClient = createClient({
  url: "https://backend-auth-node:4002/graphql",
  fetchFn: fetch,
  headers: {
    accept: "text/event-stream",
  },
});

console.log("env:", process.env);

const executor =
  (url: string): AsyncExecutor =>
  async ({ document, variables, operationName, extensions }) => {
    const query = print(document);
    console.log("query:", query);
    //const agent = new https.Agent({
    //  key: fs.readFileSync("../../certs/localhost-privkey.pem"),
    //  cert: fs.readFileSync("../../certs/localhost-cert.pem"),
    //})
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
      },
      //body: JSON.stringify({ query, variables, operationName, extensions }),
    });
    const text = fetchResult.arrayBuffer();
    console.log("text:", text);
    return text;
  };

const SSEExecutor: AsyncExecutor = async ({
  document,
  variables,
  operationName,
  extensions,
}) =>
  observableToAsyncIterable({
    subscribe: (observer) => ({
      unsubscribe: subscriptionClient.subscribe(
        {
          query: print(document),
          variables: variables as Record<string, any>,
          operationName,
          extensions,
        },
        {
          next: (data) => observer.next?.(data as unknown),
          error(err) {
            if (!observer.error) return;
            if (err instanceof Error) {
              observer.error(err);
            } else if (err instanceof CloseEvent) {
              observer.error(new Error(`Socket closed with event ${err.code}`));
            } else if (Array.isArray(err)) {
              // GraphQLError[]
              observer.error(
                new Error(err.map(({ message }) => message).join(", "))
              );
            }
          },
          complete: () => observer.complete?.(),
        }
      ),
    }),
  });

/*const httpExecutor = (url: string): AsyncExecutor => {
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
};*/

const remoteExecutorFintech = buildHTTPExecutor({
  endpoint: "https://backend-fintech:4000/graphql",
  fetch,
  headers: {
    accept: "text/event-stream",
  },
});

const remoteExecutorAuth = buildHTTPExecutor({
  endpoint: "https://backend-auth-node:4002/graphql",
  fetch,
  headers: {
    accept: "text/event-stream",
  },
});

const makeGatewaySchema = async () => {
  const schemaFintech = wrapSchema({
    schema: await schemaFromExecutor(remoteExecutorFintech),
    executor: remoteExecutorFintech,
  });
  const schemaAuth = wrapSchema({
    schema: await schemaFromExecutor(remoteExecutorAuth),
    executor: SSEExecutor,
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
  const handler = createHandler({
    schema,
    context: async (request) => {
      const rawCookies = request.headers.get("cookie") || "";
      const cookies = parseCookie(rawCookies);
      const refreshToken = cookies.refreshToken ?? "";
      const accessToken = cookies.authorization ?? "";
      try {
        const response = await jwtMiddleware(refreshToken, accessToken);
        const validAccessToken = response.getValidaccesstoken();
        request.raw.headers.authorization = validAccessToken;
        request.context.res.setHeader("accessToken", validAccessToken);
        const id = response.getId();
        const isLender = response.getIslender();
        const isBorrower = response.getIsborrower();
        const isSupport = response.getIssupport();
        if (rawCookies) {
          request.raw.headers.cookie +=
            "; " +
            cookie.serialize("id", id, {
              httpOnly: true,
            });
          request.raw.headers.cookie +=
            "; " +
            cookie.serialize("isLender", String(isLender), {
              httpOnly: true,
            });
          request.raw.headers.cookie +=
            "; " +
            cookie.serialize("isBorrower", String(isBorrower), {
              httpOnly: true,
            });
          request.raw.headers.cookie +=
            "; " +
            cookie.serialize("isSupport", String(isSupport), {
              httpOnly: true,
            });
        }
      } catch (e) {
        request.raw.headers.authorization = "";
      }
      return { request };
    },
    onSubscribe: (_req, params) => {
      const doc_id = params.extensions?.doc_id;
      const query = queryMap.find((query) => query[0] === doc_id);
      if (query) {
        return {
          schema,
          document: parse(query[1]),
          variableValues: params.variables,
          contextValue: undefined,
        };
      }
      return [null, { status: 404, statusText: "Not Found" }];
    },
    onComplete: () => {
      console.log("complete");
    },
    onOperation: (_ctx, _req, _args, result) => {
      console.log("operation-result:", result);
      return result;
    },
    onNext: (_ctx, _req, result) => {
      console.log("next-result:", result);
    },
  });
  const server = createSecureServer(
    {
      key: fs.readFileSync("../../certs/localhost-privkey.pem"),
      cert: fs.readFileSync("../../certs/localhost-cert.pem"),
      allowHTTP1: true,
    },
    async (req, res) => {
      try {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );

        const isOptions = req.method === "OPTIONS";
        if (isOptions) {
          return res.writeHead(200).end();
        } else if (req.url.startsWith("/graphql")) {
          await handler(req, res);
        }
      } catch (err) {
        res.writeHead(500).end();
      }
    }
  );
  server.listen(4001);
});
