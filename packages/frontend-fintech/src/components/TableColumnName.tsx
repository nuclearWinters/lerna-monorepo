import React, { FC, ReactNode } from "react";
import { baseTableColumnName } from "./TableColumnName.css";

export const TableColumnName: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={baseTableColumnName}>{children}</div>;
};
