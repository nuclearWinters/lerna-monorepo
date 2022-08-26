import express, { Request, Response } from "express";
import { GraphQLSchema, GraphQLObjectType } from "graphql";
import cors from "cors";
import { QueryUser } from "./QueryUser";
import { nodeField } from "./Nodes";
import { AddLendsMutation } from "./mutations/AddLends";
import { AddFundsMutation } from "./mutations/AddFunds";
import { AddLoanMutation } from "./mutations/AddLoan";
import { getContext } from "./utils";
import {
  investments_subscribe_insert,
  loans_subscribe_insert,
  transactions_subscribe_insert,
  transactions_subscribe_update,
  user_subscribe,
} from "./subscriptions/subscriptions";
import { ApproveLoanMutation } from "./mutations/ApproveLoan";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from "graphql-helix";
import cookieParser from "cookie-parser";
import { createHandler } from "graphql-sse";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: QueryUser,
    node: nodeField,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addLends: AddLendsMutation,
    addFunds: AddFundsMutation,
    addLoan: AddLoanMutation,
    approveLoan: ApproveLoanMutation,
  },
});

const Subscription = new GraphQLObjectType({
  name: "Subscription",
  description: "Subscribe to data event streams",
  fields: () => ({
    loans_subscribe_insert,
    transactions_subscribe_insert,
    transactions_subscribe_update,
    investments_subscribe_insert,
    user_subscribe,
  }),
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

const handler = async (req: Request, res: Response) => {
  const context = await getContext(req);
  const created = createHandler({ schema, context });
  return created(req, res);
};

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://relay-gateway:4001", "http://0.0.0.0:4001"],
  })
);

app.use("/graphql/stream", handler);

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

    const context = await getContext(req);

    // Validate and execute the query
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => context,
    });

    // processRequest returns one of three types of results depending on how the server should respond
    // 1) RESPONSE: a regular JSON payload
    // 2) MULTIPART RESPONSE: a multipart response (when @stream or @defer directives are used)
    // 3) PUSH: a stream of events to push back down the client for a subscription
    if (result.type === "RESPONSE") {
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

export { app };
