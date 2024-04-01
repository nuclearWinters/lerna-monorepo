import React, { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseTableColumnName = stylex.create({
  base: {
    flex: "1",
    textAlign: "center",
    color: "rgb(62,62,62)",
    padding: "4px 0px",
  },
});

export const TableColumnName: FC<{ children: ReactNode }> = ({ children }) => {
  return <div {...stylex.props(baseTableColumnName.base)}>{children}</div>;
};
