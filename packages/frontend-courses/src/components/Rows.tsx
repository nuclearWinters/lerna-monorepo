import React, { FC, ReactNode } from "react";
import { baseRows } from "./Rows.css";

interface Props {
  className?: string;
  children: ReactNode;
}

export const Rows: FC<Props> = ({ className, children }) => {
  return <div className={className || baseRows}>{children}</div>;
};
