import { tokensAndData } from "App";

export const logOut = () => {
  tokensAndData.accessToken = "";
  tokensAndData.exp = undefined;
  tokensAndData.refetchUser();
};

export const API_GATEWAY = process.env.API_GATEWAY;

export const expireSessionTime = 14;
