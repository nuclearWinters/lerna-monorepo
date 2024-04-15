import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type Settings from "./Settings";
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
      },
    };
  },
};
