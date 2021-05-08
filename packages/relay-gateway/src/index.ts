import { app } from "./app";
import { stitchSchemas, introspectSchema, AsyncExecutor } from "graphql-tools";
import { graphqlHTTP } from "express-graphql";
import fetch from "cross-fetch";
import { print } from "graphql";
import { getContext } from "./utils";

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
    graphqlHTTP((req) => ({
      schema,
      context: {
        req,
      },
      graphiql: true,
    }))
  );
  app.listen(process.env.PORT || 4001);
});
