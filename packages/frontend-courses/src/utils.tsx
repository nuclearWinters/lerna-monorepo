import { LanguageContext, tokensAndData } from "App";
import { resources } from "i18n";
import { useContext } from "react";

export const logOut = () => {
  tokensAndData.logOut(() => {
    window.location.reload();
  });
};

export const API_GATEWAY =
  process.env.API_GATEWAY || "http://localhost:4001/graphql";

export const REALTIME_GATEWAY =
  process.env.REALTIME_GATEWAY || "ws://localhost:4001/graphql";

export const useTranslation = () => {
  const [language, changeLanguage] = useContext(LanguageContext);
  const t = (text: string) => {
    if (language === "ES") {
      return text;
    }
    if (language === "DEFAULT" && navigator.language.includes("es")) {
      return text;
    }
    return resources["EN"].translation[text] || text;
  };
  return { t, changeLanguage };
};
