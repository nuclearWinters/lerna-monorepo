import { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseWrapperSmall = stylex.create({
  base: {
    backgroundColor: "white",
    margin: {
      default: "30px auto 0px auto",
      "@media (max-width: 800px)": "30px",
    },
    borderRadius: "8px",
    borderWidth: "1px",
    borderColor: "rgb(203,203,203)",
    borderStyle: "solid",
    display: "flex",
    flexDirection: "column",
    maxWidth: "600px",
  },
});

export const WrapperSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <div {...stylex.props(baseWrapperSmall.base)}>{children}</div>;
};
