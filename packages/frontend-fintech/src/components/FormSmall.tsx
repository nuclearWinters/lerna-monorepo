import React, { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseFormSmall = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    alignSelf: "center",
    width: "500px",
    flexDirection: "column",
    overflowY: "scroll",
  },
});

export const FormSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <form {...stylex.props(baseFormSmall.base)}>{children}</form>;
};
