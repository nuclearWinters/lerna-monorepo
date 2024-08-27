import type LogIn from "./LogIn";
import { JSResource } from "../../../react-router-entrypoints/JSResource";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const LogInEntryPoint: CustomSimpleEntryPoint<typeof LogIn> = {
  root: JSResource("LogIn", () => import("./LogIn")),
  getPreloadProps() {
    return {};
  },
};
