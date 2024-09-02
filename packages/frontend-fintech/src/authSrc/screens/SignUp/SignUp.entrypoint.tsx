import JSResource from "../../../react-router-elements/JSResource";
import type SignUp from "./SignUp";
import { EntryPoint } from "react-relay";

export const SignUpEntryPoint: EntryPoint<typeof SignUp> = {
  root: JSResource("SignUp", () => import("./SignUp")),
  getPreloadProps() {
    return {};
  },
};
