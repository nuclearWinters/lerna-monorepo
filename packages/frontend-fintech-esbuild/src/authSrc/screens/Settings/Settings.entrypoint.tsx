import type { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";
import type Settings from "./Settings";
import SettingsQueriesQueryParamenters from "./__generated__/SettingsQueriesAuthUserQuery$parameters";

export const SettingsEntryPoint: EntryPoint<typeof Settings> = {
  root: JSResource("Settings", () => import("./Settings")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: SettingsQueriesQueryParamenters,
          environmentProviderOptions: {
            environment: "auth",
          },
          variables: {},
        },
      },
    };
  },
};
