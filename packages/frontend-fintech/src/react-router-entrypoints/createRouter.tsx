import { BrowserHistoryOptions, createBrowserHistory, Location } from "history";
import { matchRoutes } from "./matchRouter";
import { OperationType } from "relay-runtime";
import { loadQuery, PreloadedQuery } from "react-relay";
import {
  RelayEnvironmentAuth,
  RelayEnvironmentFintech,
} from "../RelayEnvironment";
import { Entries } from "./RoutingContext";
import { RegisteredPreparedProps, Resource } from "./JSResource";
import {
  EntryPoint,
  EntryPointComponent,
  ThinQueryParamsObject,
} from "./types";
import { RouteData } from "./RouteRenderer";

export type BaseEntryPointComponent = EntryPointComponent<
  Record<string, OperationType>,
  Record<string, EntryPoint<object, object> | undefined>
>;

export interface EntryPointParams {
  params: Record<string, string>;
}

export type CustomSimpleEntryPoint<Component = BaseEntryPointComponent> =
  EntryPoint<Component, EntryPointParams>;

export interface EntryPointRoute {
  path?: string;
  strict?: boolean;
  exact?: boolean;
  sensitive?: boolean;
  entryPoint: {
    root: Resource;
    getPreloadProps: (entryPointParams: { params: Record<string, string> }) => {
      queries?: ThinQueryParamsObject<Record<string, OperationType>>;
    };
  };
  routes?: EntryPointRoute[];
  loader?: () => Promise<unknown>;
}

export default function createRouter(
  routes: EntryPointRoute[],
  options?: BrowserHistoryOptions
) {
  const history = createBrowserHistory(options);

  const initialMatches = matchRoute(routes, history.location);
  const initialEntries = prepareMatches(initialMatches);
  let currentEntry = {
    location: history.location,
    entries: initialEntries,
  };

  let nextId = 0;
  const subscribers = new Map();

  const cleanup = history.listen((location) => {
    if (location.location.pathname === currentEntry.location.pathname) {
      return;
    }
    const matches = matchRoute(routes, location.location);
    const entries = prepareMatches(matches);
    const nextEntry = {
      location: location.location,
      entries,
    };
    currentEntry = nextEntry;
    subscribers.forEach((cb) => cb(nextEntry));
  });

  const context = {
    history,
    get() {
      return currentEntry;
    },
    preloadCode(pathname: string) {
      const matches = matchRoutes(routes, pathname);
      matches.forEach(({ route }) => route.entryPoint.root.load());
    },
    preload(pathname: string) {
      const matches = matchRoutes(routes, pathname);
      prepareMatches(matches);
    },
    subscribe(cb: (entries: Entries) => void) {
      const id = nextId++;
      const dispose = () => {
        subscribers.delete(id);
      };
      subscribers.set(id, cb);
      return dispose;
    },
  };

  return { cleanup, context };
}

function matchRoute(routes: EntryPointRoute[], location: Location) {
  const matchedRoutes = matchRoutes(routes, location.pathname);
  if (!Array.isArray(matchedRoutes) || matchedRoutes.length === 0) {
    throw new Error("No route for " + location.pathname);
  }
  return matchedRoutes;
}

function prepareMatches(
  matches: {
    route: EntryPointRoute;
    match: {
      path: string;
      url: string;
      params: EntryPointParams;
      isExact: boolean;
    };
  }[]
): {
  routeData: RouteData;
  prepared: RegisteredPreparedProps;
  component: Resource;
}[] {
  return matches.map((match) => {
    const { route, match: matchData } = match;
    const queries = route?.entryPoint.getPreloadProps?.(matchData.params);
    const prepared: Record<string, PreloadedQuery<OperationType>> = {};
    for (const key in queries?.queries) {
      const query = queries.queries[key];
      const preparedQuery = loadQuery(
        query.environment === "auth"
          ? RelayEnvironmentAuth
          : RelayEnvironmentFintech,
        query.parameters,
        query.variables
      );
      prepared[key] = preparedQuery;
    }
    const Component = route?.entryPoint.root.getModuleIfRequired();
    if (Component == null) {
      route.entryPoint.root.load();
    }
    return {
      component: route.entryPoint.root,
      prepared: prepared as RegisteredPreparedProps,
      routeData: matchData,
    };
  });
}
