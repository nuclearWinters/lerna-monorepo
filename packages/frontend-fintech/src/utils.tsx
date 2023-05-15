import { LanguageContext } from "App";
import { resources } from "i18n";
import { useContext } from "react";
import { graphql, useMutation } from "react-relay";
import { utilsLogOutMutation } from "__generated__/utilsLogOutMutation.graphql";

export const useLogout = () => {
  const [commit] = useMutation<utilsLogOutMutation>(graphql`
    mutation utilsLogOutMutation($input: LogOutInput!) {
      logOut(input: $input) {
        error
      }
    }
  `);
  const logout = () => {
    commit({
      variables: {
        input: {},
      },
      onCompleted: () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userData");
        window.location.reload();
      },
    });
  };
  return logout;
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
