import { app } from "./app";
import { stitchSchemas, introspectSchema, AsyncExecutor } from "graphql-tools";
import { graphqlHTTP } from "express-graphql";
import fetch from "cross-fetch";
import { print } from "graphql";
import { getContext } from "./utils";
import { Response } from "express";
import { IContextResult } from "./utils";

const makeRemoteExecutor = (url: string): AsyncExecutor => {
  return async ({ document, variables, context }) => {
    const { cookies, authorization } = getContext(context);
    const refreshToken = cookies?.refreshToken;
    const query = typeof document === "string" ? document : print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization || "",
      },
      body: JSON.stringify({ query, variables, refreshToken }),
    });
    const response = await fetchResult.json();
    if (context) {
      ((context as unknown) as IContextResult).refreshToken =
        response?.extensions?.newRefreshToken;
    }
    return Promise.resolve(response);
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
    graphqlHTTP((req, res) => ({
      schema,
      context: {
        req,
      },
      graphiql: true,
      extensions: ({ context }) => {
        const { refreshToken } = getContext(context);
        if (refreshToken) {
          ((res as unknown) as Response).cookie("refreshToken", refreshToken, {
            sameSite: "strict",
            httpOnly: true,
            path: "/relay/graphql",
          });
        }
        return {};
      },
    }))
  );
  app.listen(process.env.PORT || 4001);
});
