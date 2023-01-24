import React, { FC, ReactNode } from "react";
import { customTable } from "./Table.css";

interface Props {
  color: "primary" | "secondary";
  children: ReactNode;
}

export const Table: FC<Props> = ({ children, color }) => {
  return (
    <div
      className={
        color === "primary" ? customTable["primary"] : customTable["default"]
      }
    >
      {children}
    </div>
  );
};
