import { app } from "./app";
import { introspectSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor, observableToAsyncIterable } from "@graphql-tools/utils";
import { graphqlHTTP } from "express-graphql";
import fetch from "cross-fetch";
import { getOperationAST, OperationTypeNode, print } from "graphql";
import ws, { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createClient } from "graphql-ws";
import { getContext } from "./utils";

const wsExecutor = (url: string): AsyncExecutor => {
  const subscriptionClient = createClient({
    url,
    webSocketImpl: ws,
  });
  return async ({ document, variables, operationName, extensions }) =>
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
            next: (data) => observer.next && observer.next(data as any),
            error: (err) => {
              if (!observer.error) return;
              if (err instanceof Error) {
                observer.error(err);
              } else if ((err as any).code) {
                observer.error(
                  new Error(`Socket closed with event ${(err as any).code}`)
                );
              } else if (Array.isArray(err)) {
                // GraphQLError[]
                observer.error(
                  new Error(err.map(({ message }) => message).join(", "))
                );
              }
            },
            complete: () => observer.complete && observer.complete(),
          }
        ),
      }),
    });
};

const httpExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const { authorization } = getContext(context);
    const query = print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          authorization ||
          JSON.stringify({ accessToken: "", refreshToken: "" }),
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };
};

const executorBoth =
  (url: string, ws: string): AsyncExecutor =>
  async (args) => {
    // get the operation node of from the document that should be executed
    const operation = getOperationAST(args.document, args.operationName);
    // subscription operations should be handled by the wsExecutor
    if (operation?.operation === OperationTypeNode.SUBSCRIPTION && ws) {
      return wsExecutor(ws)(args);
    }
    // all other operations should be handles by the httpExecutor
    return httpExecutor(url)(args);
  };

const makeGatewaySchema = async () => {
  const courses = executorBoth(
    "http://backend-courses:4000/api/graphql",
    "ws://backend-courses:4000/api/graphql"
  );
  const auth = httpExecutor("http://backend-auth:4002/auth/graphql");
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
  app.use(
    "/relay/graphql",
    graphqlHTTP((req) => {
      return {
        schema,
        context: {
          req,
        },
        graphiql: true,
      };
    })
  );
  const server = app.listen(4001, () => {
    const wsServer = new WebSocketServer({
      server,
      path: "/relay/graphql",
    });
    useServer({ schema }, wsServer);
  });
});
