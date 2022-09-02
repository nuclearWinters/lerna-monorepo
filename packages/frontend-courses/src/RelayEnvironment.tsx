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
import { API_GATEWAY, REALTIME_GATEWAY } from "utils";
import { Client, ClientOptions, createClient, Sink } from "graphql-ws";

interface RestartableClient extends Client {
  restart(): void;
}

const createRestartableClient = (options: ClientOptions): RestartableClient => {
  let restartRequested = false;
  let restart = () => {
    restartRequested = true;
  };

  const client = createClient({
    ...options,
    on: {
      ...options.on,
      opened: (socket) => {
        options.on?.opened?.(socket);

        restart = () => {
          if (socket.readyState === WebSocket.OPEN) {
            // if the socket is still open for the restart, do the restart
            socket.close(4205, "Client Restart");
          } else {
            // otherwise the socket might've closed, indicate that you want
            // a restart on the next opened event
            restartRequested = true;
          }
        };

        // just in case you were eager to restart
        if (restartRequested) {
          restartRequested = false;
          restart();
        }
      },
    },
  });

  return {
    ...client,
    restart: () => restart(),
  };
};

export const subscriptionsClient = createRestartableClient({
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
