import type SignUp from "./SignUp";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";
import { JSResource } from "../../../react-router-entrypoints/JSResource";

export const SignUpEntryPoint: CustomSimpleEntryPoint<typeof SignUp> = {
  root: JSResource("SignUp", () => import("./SignUp")),
  getPreloadProps() {
    return {};
  },
};
