import type { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";
import type LogIn from "./LogIn";

export const LogInEntryPoint: EntryPoint<typeof LogIn> = {
  root: JSResource("LogIn", () => import("./LogIn")),
  getPreloadProps() {
    return {};
  },
};
