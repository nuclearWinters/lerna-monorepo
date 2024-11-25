import type { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";
import type SignUp from "./SignUp";

export const SignUpEntryPoint: EntryPoint<typeof SignUp> = {
  root: JSResource("SignUp", () => import("./SignUp")),
  getPreloadProps() {
    return {};
  },
};
