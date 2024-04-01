import React, { FC } from "react";
import { baseSider } from "Routes";
import * as stylex from "@stylexjs/stylex";

export const SiderNotLogged: FC = () => {
  return <div {...stylex.props(baseSider.base)} />;
};
