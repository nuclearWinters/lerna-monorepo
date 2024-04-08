import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type Settings from "./Settings";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import SettingsQueriesQueryParamenters from "./__generated__/SettingsQueriesAuthUserQuery$parameters";

export const SettingsEntryPoint: SimpleEntryPoint<typeof Settings> = {
  root: JSResource("Settings", () => import("./Settings")),
  getPreloadProps() {
    return {
      queries: {
        query: {
          parameters: SettingsQueriesQueryParamenters,
          variables: {},
        },
        authQuery: {
          parameters: utilsQueryParameters,
          variables: {},
        },
      },
    };
  },
};
