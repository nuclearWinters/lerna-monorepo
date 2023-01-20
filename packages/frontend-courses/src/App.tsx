import React, { createContext, FC, useState, Suspense } from "react";
import {
  graphql,
  RelayEnvironmentProvider,
  loadQuery,
} from "react-relay/hooks";
import { RelayEnvironment } from "./RelayEnvironment";
import { AppUserQuery as AppUserQueryType } from "./__generated__/AppUserQuery.graphql";
import { routes } from "./Routes";
import { Spinner } from "components/Spinner";
import {
  createBrowserRouter,
  RouteConfig,
  RouteRenderer,
  RouterProvider,
} from "yarr";
import { baseApp } from "App.css";
import { Languages } from "__generated__/Routes_query.graphql";
import {
  baseRoutes,
  baseRoutesContent,
  baseSider,
  customHeader,
} from "Routes.css";
import { Sider } from "components/Sider";
import { Header } from "components/Header";

export const tokensAndData: {
  accessToken: string;
  exp?: number;
  redirectTo: string;
} = {
  accessToken: "",
  exp: undefined,
  redirectTo: "",
};

const AppUserQuery = graphql`
  query AppUserQuery {
    user {
      id
      accountAvailable
      accountTotal
      accountId
    }
    authUser {
      id
      name
      apellidoPaterno
      apellidoMaterno
      language
      isBorrower
      isSupport
    }
  }
`;

export const preloadQuery = loadQuery<AppUserQueryType>(
  RelayEnvironment,
  AppUserQuery,
  {}
);

const router = createBrowserRouter<RouteConfig<string, string, any>[]>({
  routes,
});

export const LanguageContext = createContext<
  [Languages, React.Dispatch<React.SetStateAction<Languages>>]
>(["EN", () => {}]);

export const App: FC = () => {
  const [language, setLanguage] = useState<Languages>("EN");
  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <RouterProvider router={router}>
          <div className={baseRoutes}>
            <Suspense
              fallback={
                <div className={baseSider}>
                  <Spinner />
                </div>
              }
            >
              <Sider />
            </Suspense>
            <Suspense
              fallback={
                <div className={customHeader["fallback"]}>
                  <Spinner />
                </div>
              }
            >
              <Header />
            </Suspense>
            <Suspense
              fallback={
                <div className={baseApp}>
                  <Spinner />
                </div>
              }
            >
              <RouteRenderer
                routeWrapper={({ Route }) => (
                  <div className={baseRoutesContent}>{Route}</div>
                )}
              />
            </Suspense>
          </div>
        </RouterProvider>
      </RelayEnvironmentProvider>
    </LanguageContext.Provider>
  );
};
