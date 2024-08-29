import {
  PreloadedQuery,
  RelayEnvironmentProvider,
  usePreloadedQuery,
} from "react-relay/hooks";
import { Languages, useTranslation } from "../utils";
import { FC, useCallback, useEffect } from "react";
//import { useLocation, useNavigate } from "react-router-dom";
import { authUserQuery } from "../authSrc/utilsAuth";
import { utilsAuthQuery } from "../authSrc/__generated__/utilsAuthQuery.graphql";
import { utilsFintechQuery } from "../fintechSrc/__generated__/utilsFintechQuery.graphql";
import { SiderFintech } from "../fintechSrc/components/SiderFintech";
import { RelayEnvironmentFintech } from "../RelayEnvironment";

export const Sider: FC<{
  authQuery: PreloadedQuery<utilsAuthQuery, Record<string, unknown>>;
  fintechQuery: PreloadedQuery<utilsFintechQuery, Record<string, unknown>>;
}> = ({ authQuery, fintechQuery }) => {
  const { changeLanguage } = useTranslation();
  const { authUser } = usePreloadedQuery<utilsAuthQuery>(
    authUserQuery,
    authQuery
  );

  //const { pathname: location } = useLocation();
  //const navigate = useNavigate();

  const navigate = useCallback((path: string) => path, []);
  const location = "";

  useEffect(() => {
    if (!authUser) {
      const isLoggedPage = !["/login", "/register", "/"].includes(location);
      if (isLoggedPage) {
        navigate(`/login${isLoggedPage ? `?redirectTo=${location}` : ""}`);
      }
    } else {
      const isNotLoggedPage = ["/login", "/register", "/"].includes(location);
      if (isNotLoggedPage) {
        if (authUser.isBorrower) {
          navigate("/myLoans");
        } else if (authUser.isLender) {
          navigate("/myInvestments");
        } else if (authUser.isSupport) {
          navigate("/approveLoan");
        }
      }
    }
  }, [authUser, navigate, location]);

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
