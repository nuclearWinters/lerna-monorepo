import { LanguageContext } from "./App";
import { resources } from "./i18n";
import { useContext } from "react";
import { graphql, useMutation } from "react-relay";
import { utilsLogOutMutation } from "./__generated__/utilsLogOutMutation.graphql";

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
  query utilsQuery @preloadable {
    user {
      id
      accountAvailable
      accountTotal
    }
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
