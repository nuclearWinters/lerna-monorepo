import type RetireFunds from "./RetireFunds";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { JSResource } from "../../../react-router-entrypoints/JSResource";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const RetireFundsEntryPoint: CustomSimpleEntryPoint<typeof RetireFunds> =
  {
    root: JSResource("RetireFunds", () => import("./RetireFunds")),
    getPreloadProps() {
      return {
        queries: {
          authQuery: {
            parameters: utilsAuthQueryParameters,
            environment: "auth",
            variables: {},
          },
        },
      };
    },
  };
