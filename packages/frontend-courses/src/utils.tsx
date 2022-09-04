import { tokensAndData } from "App";
import { RelayEnvironment, subscriptionsClient } from "RelayEnvironment";
import { commitCommentCreateLocally } from "screens/MyInvestments";

export const logOut = () => {
  tokensAndData.accessToken = "";
  tokensAndData.exp = undefined;
  commitCommentCreateLocally(RelayEnvironment, "on_going");
  tokensAndData.refetchUser();
  subscriptionsClient.restart();
};

export const API_GATEWAY =
  process.env.API_GATEWAY || "http://localhost:4001/graphql";

export const REALTIME_GATEWAY =
  process.env.REALTIME_GATEWAY || "ws://localhost:4001/graphql";

export const expireSessionTime = 14;
