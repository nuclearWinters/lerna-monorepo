import React, { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props {
  color: "primary" | "secondary";
  children: ReactNode;
}

export const baseTable = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    flexDirection: "row",
    margin: "10px 10px",
    borderRadius: "8px",
  },
  primary: {
    backgroundColor: "rgba(255,90,96,0.1)",
  },
  default: {
    backgroundColor: "rgba(90,96,255,0.1)",
  },
});

export const Table: FC<Props> = ({ children, color }) => {
  return (
    <div
      {...stylex.props(
        baseTable.base,
        color === "primary" ? baseTable.primary : baseTable.default
      )}
    >
      {children}
    </div>
  );
};
