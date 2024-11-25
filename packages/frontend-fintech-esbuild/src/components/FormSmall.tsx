import * as stylex from "@stylexjs/stylex";
import type { FC, ReactNode } from "react";

export const baseFormSmall = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    alignSelf: "center",
    maxWidth: "500px",
    width: "100%",
    flexDirection: "column",
    overflowY: "scroll",
  },
});

export const FormSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <form {...stylex.props(baseFormSmall.base)}>{children}</form>;
};
