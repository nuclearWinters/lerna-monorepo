import { app } from "./app";
import { introspectSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import { AsyncExecutor, observableToAsyncIterable } from "@graphql-tools/utils";
import { getOperationAST, OperationTypeNode, print } from "graphql";
import { createClient } from "graphql-ws";
import { getContext, IContextResult, setCookieContext } from "./utils";
import { useServer } from "graphql-ws/lib/use/ws";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { fetch } from "cross-undici-fetch";
import ws, { WebSocketServer } from "ws";

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
    if (cookiesResponse) {
      setCookieContext(context, cookiesResponse);
    }
    return fetchResult.json();
  };
};

const executorBoth =
  (url: string, streamUrl: string): AsyncExecutor =>
  async (args) => {
    // get the operation node of from the document that should be executed
    const operation = getOperationAST(args.document, args.operationName);
    // subscription operations should be handled by the wsExecutor
    if (operation?.operation === OperationTypeNode.SUBSCRIPTION) {
      return wsExecutor(streamUrl)(args);
    }
    // all other operations should be handles by the httpExecutor
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
              observer.next && observer.next(data as unknown);
            },
            error: (err) => {
              if (!observer.error) return;
              if (err instanceof Error) {
                observer.error(err);
              } else if (err instanceof CloseEvent) {
                observer.error(
                  new Error(`Socket closed with event ${err.code}`)
                );
              } else if (Array.isArray(err)) {
                // GraphQLError[]
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
    // Create a generic Request object that can be consumed by Graphql Helix's API
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    // Determine whether we should render GraphiQL instead of returning an API response
    if (shouldRenderGraphiQL(request)) {
      res.send(renderGraphiQL());
    } else {
      // Extract the GraphQL parameters from the request
      const { operationName, query, variables } = getGraphQLParameters(request);

      // Validate and execute the query
      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => ({ req }),
      });

      // processRequest returns one of three types of results depending on how the server should respond
      // 1) RESPONSE: a regular JSON payload
      // 2) MULTIPART RESPONSE: a multipart response (when @stream or @defer directives are used)
      // 3) PUSH: a stream of events to push back down the client for a subscription
      if (result.type === "RESPONSE") {
        const cookies = (result.context as IContextResult | undefined)?.cookies;
        if (cookies) {
          res.setHeader("Set-Cookie", cookies);
        }
        // We set the provided status and headers and just the send the payload back to the client
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        res.json(result.payload);
      } else if (result.type === "MULTIPART_RESPONSE") {
        // Indicate we're sending a multipart response
        res.writeHead(200, {
          Connection: "keep-alive",
          "Content-Type": 'multipart/mixed; boundary="-"',
          "Transfer-Encoding": "chunked",
        });

        // If the request is closed by the client, we unsubscribe and stop executing the request
        req.on("close", () => {
          result.unsubscribe();
        });

        res.write("---");

        // Subscribe and send back each result as a separate chunk. We await the subscribe
        // call. Once we're done executing the request and there are no more results to send
        // to the client, the Promise returned by subscribe will resolve and we can end the response.
        await result.subscribe((result) => {
          const chunk = Buffer.from(JSON.stringify(result), "utf8");
          const data = [
            "",
            "Content-Type: application/json; charset=utf-8",
            "Content-Length: " + String(chunk.length),
            "",
            chunk,
          ];

          if (result.hasNext) {
            data.push("---");
          }

          res.write(data.join("\r\n"));
        });

        res.write("\r\n-----\r\n");
        res.end();
      } else {
        // Indicate we're sending an event stream to the client
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        });

        // If the request is closed by the client, we unsubscribe and stop executing the request
        req.on("close", () => {
          result.unsubscribe();
        });

        // We subscribe to the event stream and push any new events to the client
        await result.subscribe((result) => {
          res.write(`data: ${JSON.stringify(result)}\n\n`);
        });
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
