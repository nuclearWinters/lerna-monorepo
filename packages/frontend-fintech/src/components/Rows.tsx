import * as stylex from "@stylexjs/stylex";
import type { FC, ReactNode } from "react";

interface Props {
  styleX?: stylex.StyleXStyles[];
  children: ReactNode;
}

export const baseRows = stylex.create({
  base: {
    display: "flex",
    flexDirection: "column",
  },
  flex1: {
    flex: "1",
  },
  lender: {
    width: "300px",
  },
  transactions: {
    flex: "1",
    margin: "0px 12px",
  },
});

export const Rows: FC<Props> = ({ styleX, children }) => {
  return <div {...stylex.props(styleX || baseRows.base)}>{children}</div>;
};
