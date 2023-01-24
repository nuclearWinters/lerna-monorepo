import React, { FC, ReactNode } from "react";
import { baseColumn } from "./Column.css";

interface Props {
  className?: string;
  children: ReactNode;
}

export const Columns: FC<Props> = ({ className, children }) => {
  return <div className={className || baseColumn}>{children}</div>;
};
