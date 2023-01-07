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
import { API_GATEWAY, logOut, REALTIME_GATEWAY } from "utils";
import { createClient, Sink } from "graphql-ws";
import jwtDecode from "jwt-decode";

export const subscriptionsClient = createClient({
  url: REALTIME_GATEWAY,
  connectionParams: () => {
    return {
      Authorization: tokensAndData.accessToken,
    };
  },
});

const fetchRelay = async (params: RequestParameters, variables: Variables) => {
  const response = await fetch(API_GATEWAY, {
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
  const data = await response.json();
  const accesstoken = response.headers.get("accessToken");
  if (accesstoken && tokensAndData.accessToken !== accesstoken) {
    tokensAndData.accessToken = accesstoken;
    const decoded = jwtDecode<{ refreshTokenExpireTime: number }>(accesstoken);
    tokensAndData.exp = decoded.refreshTokenExpireTime;
  } else if (!accesstoken && tokensAndData.accessToken) {
    logOut();
  }

  return data;
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
