import { app } from "./app";
import {
  stitchSchemas,
  introspectSchema,
  AsyncExecutor,
  Subscriber,
} from "graphql-tools";
import { graphqlHTTP } from "express-graphql";
import fetch from "cross-fetch";
import { print } from "graphql";
import { getContext } from "./utils";
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createClient } from "graphql-ws";

const makeRemoteSubscriber = (url: string): Subscriber => {
  const client = createClient({ url, webSocketImpl: ws });
  return async ({ document, variables }) => {
    const pending: any[] = [];
    let deferred: any = null;
    let error: Error | null = null;
    let done = false;

    const query = print(document);
    const dispose = client.subscribe<any>(
      {
        query,
        variables: variables as any,
      },
      {
        next: (data: any) => {
          pending.push(data);
          deferred && deferred.resolve(false);
        },
        error: (err: Error) => {
          error = err;
          deferred && deferred.reject(error);
        },
        complete: () => {
          done = true;
          deferred && deferred.resolve(true);
        },
      }
    );

    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      async next() {
        if (done) return { done: true, value: undefined };
        if (error) throw error;
        if (pending.length) return { value: pending.shift() };
        return (await new Promise(
          (resolve, reject) => (deferred = { resolve, reject })
        ))
          ? { done: true, value: undefined }
          : { value: pending.shift() };
      },
      async return() {
        dispose();
        return { done: true, value: undefined };
      },
    };
  };
};

const makeRemoteExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const { authorization } = getContext(context);
    const query = typeof document === "string" ? document : print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization || "",
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };
};

const makeGatewaySchema = async () => {
  const courses = makeRemoteExecutor("http://backend-courses:4000/api/graphql");
  const auth = makeRemoteExecutor("http://backend-auth:4002/auth/graphql");
  const gatewaySchema = stitchSchemas({
    subschemas: [
      {
        schema: await introspectSchema(courses),
        executor: courses,
        subscriber: makeRemoteSubscriber(
          "ws://backend-courses:4000/api/graphql"
        ),
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
    const wsServer = new ws.Server({
      server,
      path: "/relay/graphql",
    });
    useServer({ schema }, wsServer);
  });
});
