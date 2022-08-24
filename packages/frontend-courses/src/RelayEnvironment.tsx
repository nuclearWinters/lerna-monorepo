import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  Observable,
  GraphQLResponse,
} from "relay-runtime";
import { tokensAndData } from "App";
import { API_GATEWAY } from "utils";
import { createClient, Sink } from "graphql-sse";

export const subscriptionsClient = createClient({
  url: API_GATEWAY
    ? API_GATEWAY + "/stream"
    : "http://localhost:4001/graphql/stream",
  headers: () => {
    return {
      Authorization: tokensAndData.accessToken,
    };
  },
  credentials: "include",
});

const fetchRelay = async (params: RequestParameters, variables: Variables) => {
  const response = await fetch(API_GATEWAY || "http://localhost:4001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokensAndData.accessToken,
    },
    credentials: "include",
    body: JSON.stringify({
      query: params?.text || "",
      variables,
    }),
  });
  return await response.json();
};

const subscribeRelay = (operation: RequestParameters, variables: Variables) => {
  return Observable.create<GraphQLResponse>((sink) => {
    if (!operation.text) {
      return sink.error(new Error("Operation text cannot be empty"));
    }
    return subscriptionsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink as Sink
    );
  });
};

const network = Network.create(fetchRelay, subscribeRelay);

export const RelayEnvironment = new Environment({
  network: network,
  store: new Store(new RecordSource()),
});
