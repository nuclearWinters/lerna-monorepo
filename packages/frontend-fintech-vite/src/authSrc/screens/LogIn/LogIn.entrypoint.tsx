import JSResource from "../../../react-router-elements/JSResource";
import type LogIn from "./LogIn";
import { EntryPoint } from "react-relay";

export const LogInEntryPoint: EntryPoint<typeof LogIn> = {
  root: JSResource("LogIn", () => import("./LogIn")),
  getPreloadProps() {
    return {};
  },
};
