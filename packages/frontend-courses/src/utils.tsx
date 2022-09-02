import { tokensAndData } from "App";
import { subscriptionsClient } from "RelayEnvironment";

export const logOut = () => {
  tokensAndData.accessToken = "";
  tokensAndData.exp = undefined;
  tokensAndData.refetchUser();
  subscriptionsClient.restart();
};

export const API_GATEWAY =
  process.env.API_GATEWAY || "http://localhost:4001/graphql";

export const REALTIME_GATEWAY =
  process.env.REALTIME_GATEWAY || "ws://localhost:4001/graphql";

export const expireSessionTime = 14;
