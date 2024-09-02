import {
  PreloadedQuery,
  RelayEnvironmentProvider,
  usePreloadedQuery,
} from "react-relay/hooks";
import { Languages, useTranslation } from "../utils";
import { FC, useEffect } from "react";
import { authUserQuery } from "../authSrc/utilsAuth";
import { utilsAuthQuery } from "../authSrc/__generated__/utilsAuthQuery.graphql";
import { utilsFintechQuery } from "../fintechSrc/__generated__/utilsFintechQuery.graphql";
import { SiderFintech } from "../fintechSrc/components/SiderFintech";
import { RelayEnvironmentFintech } from "../RelayEnvironment";
import { historyReplace, useLocation } from "../react-router-elements/utils";

export const Sider: FC<{
  authQuery: PreloadedQuery<utilsAuthQuery, Record<string, unknown>>;
  fintechQuery: PreloadedQuery<utilsFintechQuery, Record<string, unknown>>;
}> = ({ authQuery, fintechQuery }) => {
  const { changeLanguage } = useTranslation();
  const { authUser } = usePreloadedQuery<utilsAuthQuery>(
    authUserQuery,
    authQuery
  );

  const location = useLocation();

  //Redirect logic
  useEffect(() => {
    //If user is not logged, redirect to login page
    if (!authUser) {
      const isLoggedPage = !["/register", "/"].includes(location);
      if (isLoggedPage) {
        historyReplace(
          `/${isLoggedPage ? `?redirectTo=${location}` : ""}`
        );
      }
    } else {
      //If user is logged, redirect to appropriate page
      const isNotLoggedPage = ["/register", "/"].includes(location);
      if (isNotLoggedPage) {
        if (authUser.isBorrower) {
          historyReplace("/myLoans");
        } else if (authUser.isLender) {
          historyReplace("/myInvestments");
        } else if (authUser.isSupport) {
          historyReplace("/approveLoan");
        }
      }
    }
  }, [authUser, location]);

  //Language logic; create a hook for this and use it elsewhere
  useEffect(() => {
    const navigatorLanguage = navigator.language.includes("es") ? "ES" : "EN";
    const language = authUser?.language;
    if (language && language !== navigatorLanguage) {
      changeLanguage(language as Languages);
    }
  }, [authUser, changeLanguage]);

  if (!authUser) {
    return null;
  }

  const { isBorrower, isSupport, isLender } = authUser;

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <SiderFintech
        fintechQuery={fintechQuery}
        isBorrower={isBorrower}
        isSupport={isSupport}
        isLender={isLender}
      />
    </RelayEnvironmentProvider>
  );
};
