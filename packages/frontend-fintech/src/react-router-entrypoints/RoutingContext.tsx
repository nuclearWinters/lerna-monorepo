import { BrowserHistory, Location } from "history";
import { createContext } from "react";
import { EntryPointParams } from "../react-router-entrypoints/createRouter";
import { RegisteredPreparedProps, Resource } from "./JSResource";

export interface Entry {
  component: Resource;
  prepared: RegisteredPreparedProps;
  routeData: {
    path: string;
    url: string;
    params: EntryPointParams;
    isExact: boolean;
  };
}

export interface Entries {
  location: Location;
  entries: Entry[];
}

export const RoutingContext = createContext<null | {
  history: BrowserHistory;
  get: () => Entries;
  preloadCode: (pathname: string) => void;
  preload: (pathname: string) => void;
  subscribe: (cb: (entries: Entries) => void) => () => void;
}>(null);
