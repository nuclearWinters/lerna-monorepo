import type LogIn from "./LogIn";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const LogInEntryPoint: SimpleEntryPoint<typeof LogIn> = {
  root: JSResource("LogIn", () => import("./LogIn")),
  getPreloadProps() {
    return {};
  },
};
