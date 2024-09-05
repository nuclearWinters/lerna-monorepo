import { resources } from "../i18n";
import { useContext } from "react";
import { useMutation } from "react-relay/hooks";
import { graphql } from "react-relay";
import { utilsAuthLogOutMutation } from "./__generated__/utilsAuthLogOutMutation.graphql";
import { LanguageContext } from "../utils";

export interface Decode {
  id: string;
  isBorrower: boolean;
  isLender: boolean;
  isSupport: boolean;
  refreshTokenExpireTime: number;
  exp: number;
}

export type Languages = "EN" | "ES";

export const useLogout = () => {
  const [commit] = useMutation<utilsAuthLogOutMutation>(graphql`
    mutation utilsAuthLogOutMutation($input: LogOutInput!) {
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

export const AUTH_API =
  import.meta.env.REALTIME_GATEWAY || "https://localhost:4002/graphql";

export const FINTECH_API =
  import.meta.env.REALTIME_GATEWAY || "https://localhost:4000/graphql";

export const useTranslation = () => {
  const [language, changeLanguage] = useContext(LanguageContext);
  const t = (text: string) => {
    if (language === "ES") {
      return text;
    }
    return resources["EN"].translation[text] || text;
  };
  return { t, changeLanguage };
};

export const getUserDataCache = (): Decode | null => {
  const userData = sessionStorage.getItem("userData");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const supportPages = ["/approveLoan", "/settings"];

export const borrowerPages = [
  "/account",
  "/addLoan",
  "/myLoans",
  "/addFunds",
  "/retireFunds",
  "/settings",
  "/myTransactions",
];

export const defaultSupport = "/approveLoan";
export const defaultBorrower = "/myLoans";
export const defaultLender = "/addInvestments";

export const lenderPages = [
  "/account",
  "/addInvestments",
  "/addFunds",
  "/retireFunds",
  "/myInvestments",
  "/myTransactions",
  "/settings",
];

export const authUserQuery = graphql`
  query utilsAuthQuery @preloadable {
    authUser {
      id
      name
      apellidoPaterno
      apellidoMaterno
      RFC
      CURP
      clabe
      mobile
      isLender
      isBorrower
      isSupport
      language
      email
    }
  }
`;
