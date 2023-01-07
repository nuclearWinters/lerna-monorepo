import React, { createContext, FC, useState } from "react";
import {
  graphql,
  RelayEnvironmentProvider,
  loadQuery,
} from "react-relay/hooks";
import { RelayEnvironment } from "./RelayEnvironment";
import { AppUserQuery as AppUserQueryType } from "./__generated__/AppUserQuery.graphql";
import { Header, routes } from "./Routes";
import { Spinner } from "components/Spinner";
import {
  createBrowserRouter,
  RouteConfig,
  RouteRenderer,
  RouterProvider,
} from "yarr";
import { baseApp } from "App.css";
import { Languages } from "__generated__/Routes_query.graphql";

const { Suspense } = React;

export const tokensAndData: {
  accessToken: string;
  exp?: number;
  logOut: (callback?: () => void) => void;
} = {
  accessToken: "",
  exp: undefined,
  logOut: () => {},
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
        <Suspense
          fallback={
            <div className={baseApp}>
              <Spinner />
            </div>
          }
        >
          <RouterProvider router={router}>
            <RouteRenderer
              routeWrapper={({ Route }) => <Header>{Route}</Header>}
            />
          </RouterProvider>
        </Suspense>
      </RelayEnvironmentProvider>
    </LanguageContext.Provider>
  );
};
