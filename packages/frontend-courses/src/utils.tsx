import { tokensAndData } from "App";
import { resources } from "i18n";
import { useState } from "react";
import { RelayEnvironment, subscriptionsClient } from "RelayEnvironment";
import { commitCommentCreateLocally } from "screens/MyInvestments";
import { Languages } from "__generated__/Routes_query.graphql";

export const logOut = () => {
  tokensAndData.accessToken = "";
  tokensAndData.exp = undefined;
  commitCommentCreateLocally(RelayEnvironment, "none");
  tokensAndData.refetchUser();
  subscriptionsClient.restart();
};

export const API_GATEWAY =
  process.env.API_GATEWAY || "http://localhost:4001/graphql";

export const REALTIME_GATEWAY =
  process.env.REALTIME_GATEWAY || "ws://localhost:4001/graphql";

export const expireSessionTime = 14;

export const useTranslation = () => {
  const [language, changeLanguage] = useState<Languages>("EN");
  const t = (text: string) => {
    if (language !== "EN") {
      return text;
    }
    return resources[language].translation[text] || text;
  };
  return { t, changeLanguage };
};
