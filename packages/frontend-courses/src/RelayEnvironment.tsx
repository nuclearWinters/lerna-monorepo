import { Environment, Network, RecordSource, Store } from "relay-runtime";
import fetchGraphQL from "./fetchGraphQL";

const fetchRelay = async (
  params: Record<any, any>,
  variables: Record<any, any>
) => {
  return fetchGraphQL(params.text, variables);
};

export const RelayEnvironment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
