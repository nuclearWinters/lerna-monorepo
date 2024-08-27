import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";
import { JSResource } from "../../../react-router-entrypoints/JSResource";

import type Settings from "./Settings";
import SettingsQueriesQueryParamenters from "./__generated__/SettingsQueriesAuthUserQuery$parameters";

export const SettingsEntryPoint: CustomSimpleEntryPoint<typeof Settings> = {
  root: JSResource("Settings", () => import("./Settings")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: SettingsQueriesQueryParamenters,
          environment: "auth",
          variables: {},
        },
      },
    };
  },
};
