import React, { FC } from "react";
import {
  graphql,
  RelayEnvironmentProvider,
  loadQuery,
} from "react-relay/hooks";
import { RelayEnvironment } from "./RelayEnvironment";
import { AppUserQuery as AppUserQueryType } from "./__generated__/AppUserQuery.graphql";
import { Header, routes } from "./Routes";
import { Spinner } from "components/Spinner";
import { Dayjs } from "dayjs";
import {
  createBrowserRouter,
  RouteConfig,
  RouteRenderer,
  RouterProvider,
} from "yarr";
import { baseApp } from "App.css";

const { Suspense } = React;

export const tokensAndData: {
  refetchUser: () => void;
  accessToken: string;
  exp?: Dayjs;
} = {
  accessToken: "",
  exp: undefined,
  refetchUser: () => {},
};

const AppUserQuery = graphql`
  query AppUserQuery {
    user {
      id
      statusLocal
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

export const App: FC = () => {
  return (
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
  );
};
