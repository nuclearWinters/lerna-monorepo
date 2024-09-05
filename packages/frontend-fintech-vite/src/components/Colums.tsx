import { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props {
  styleX?: stylex.StyleXStyles[];
  children: ReactNode;
}

export const baseColumn = stylex.create({
  base: {
    display: "flex",
  },
  columnJustifyCenter: {
    justifyContent: "center",
  },
  columnLoanRow: {
    marginBottom: "6px",
  },
});

export const Columns: FC<Props> = ({ styleX, children }) => {
  return <div {...stylex.props(styleX || baseColumn.base)}>{children}</div>;
};
