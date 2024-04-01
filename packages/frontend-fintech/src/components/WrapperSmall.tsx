import React, { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseWrapperSmall = stylex.create({
  base: {
    backgroundColor: "white",
    margin: "30px 0px",
    borderRadius: "8px",
    borderWidth: "1px",
    borderColor: "rgb(203,203,203)",
    borderStyle: "solid",
    display: "flex",
    flexDirection: "column",
    width: "600px",
  },
});

export const WrapperSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <div {...stylex.props(baseWrapperSmall.base)}>{children}</div>;
};
