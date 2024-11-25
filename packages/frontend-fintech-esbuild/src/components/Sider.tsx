import { type FC, useEffect } from "react";
import { type PreloadedQuery, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import { RelayEnvironmentFintech } from "../RelayEnvironment";
import type { utilsAuthQuery } from "../authSrc/__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../authSrc/utilsAuth";
import type { utilsFintechQuery } from "../fintechSrc/__generated__/utilsFintechQuery.graphql";
import { SiderFintech } from "../fintechSrc/components/SiderFintech";
import { historyReplace, useLocation } from "../react-router-elements/utils";
import { type Languages, useTranslation } from "../utils";

export const Sider: FC<{
  authQuery: PreloadedQuery<utilsAuthQuery>;
  fintechQuery: PreloadedQuery<utilsFintechQuery>;
}> = ({ authQuery, fintechQuery }) => {
  const { changeLanguage } = useTranslation();
  const { authUser } = usePreloadedQuery(authUserQuery, authQuery);

  const location = useLocation();

  //Redirect logic
  useEffect(() => {
    //If user is not logged, redirect to login page
    if (!authUser) {
      const isLoggedPage = !["/register", "/"].includes(location);
      if (isLoggedPage) {
        historyReplace(`/${isLoggedPage ? `?redirectTo=${location}` : ""}`);
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
      <SiderFintech fintechQuery={fintechQuery} isBorrower={isBorrower} isSupport={isSupport} isLender={isLender} />
    </RelayEnvironmentProvider>
  );
};
