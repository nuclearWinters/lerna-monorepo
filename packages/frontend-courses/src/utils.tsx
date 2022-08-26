import { tokensAndData } from "App";

export const logOut = () => {
  tokensAndData.accessToken = "";
  tokensAndData.exp = undefined;
  tokensAndData.refetchUser();
};

export const API_GATEWAY =
  process.env.API_GATEWAY || "http://localhost:4001/graphql";

export const expireSessionTime = 14;
