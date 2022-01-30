import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  GraphQLResponse,
  Observable,
} from "relay-runtime";
import { createClient } from "graphql-ws";
import { tokensAndData } from "App";
import { API_GATEWAY, WS_GATEWAY } from "utils";

const subscriptionsClient = createClient({
  url: WS_GATEWAY || "ws://localhost/relay/graphql",
  connectionParams: () => {
    return {
      Authorization: JSON.stringify({
        accessToken: tokensAndData.tokens.accessToken,
        refreshToken: tokensAndData.tokens.refreshToken,
      }),
    };
  },
});

const fetchGraphQL = async (text: string, variables: Record<any, any>) => {
  const response = await fetch(
    API_GATEWAY || "http://0.0.0.0:4001/relay/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.stringify({
          accessToken: tokensAndData.tokens.accessToken,
          refreshToken: tokensAndData.tokens.refreshToken,
        }),
      },
      body: JSON.stringify({
        query: text,
        variables,
      }),
    }
  );
  return await response.json();
};

const fetchRelay = async (params: Record<any, any>, variables: Variables) => {
  return fetchGraphQL(params.text, variables);
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
      sink as any
    );
  });
};

const network = Network.create(fetchRelay, subscribeRelay);

export const RelayEnvironment = new Environment({
  network: network,
  store: new Store(new RecordSource()),
});
