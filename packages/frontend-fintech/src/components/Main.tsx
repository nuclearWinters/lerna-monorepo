import React, { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseMain = stylex.create({
  base: {
    backgroundColor: "rgb(248,248,248)",
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export const Main: FC<{ children: ReactNode }> = ({ children }) => {
  return <div {...stylex.props(baseMain.base)}>{children}</div>;
};
