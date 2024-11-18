import * as stylex from "@stylexjs/stylex";
import type { FC, ReactNode } from "react";

interface Props {
  styleX?: stylex.StyleXStyles[];
  children: ReactNode;
}

export const baseWrapperBig = stylex.create({
  base: {
    backgroundColor: "white",
    margin: "30px 20px",
    borderRadius: "8px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "rgb(203,203,203)",
    display: "flex",
    flexDirection: "column",
    flex: "1",
  },
  settings: {
    margin: "30px 60px",
  },
});

export const WrapperBig: FC<Props> = ({ children, styleX }) => {
  return <div {...stylex.props(styleX || baseWrapperBig.base)}>{children}</div>;
};
