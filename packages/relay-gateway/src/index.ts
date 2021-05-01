import { app } from "./app";
import { stitchSchemas, introspectSchema, AsyncExecutor } from "graphql-tools";
import { graphqlHTTP } from "express-graphql";
import fetch from "cross-fetch";
import { print } from "graphql";

interface GraphQLContext {
  authorization: string | undefined;
}

const makeRemoteExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const query = typeof document === "string" ? document : print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          ((context as unknown) as GraphQLContext)?.authorization || "",
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
      context: { authorization: req.headers.authorization },
      graphiql: true,
    }))
  );
  app.listen(process.env.PORT || 4001);
});
