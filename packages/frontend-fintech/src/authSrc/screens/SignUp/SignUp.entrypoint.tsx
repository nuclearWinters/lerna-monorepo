import type SignUp from "./SignUp";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const SignUpEntryPoint: SimpleEntryPoint<typeof SignUp> = {
  root: JSResource("SignUp", () => import("./SignUp")),
  getPreloadProps() {
    return {};
  },
};
