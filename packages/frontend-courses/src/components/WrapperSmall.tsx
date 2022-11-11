import React, { FC, ReactNode } from "react";
import { baseWrapperSmall } from "./WrapperSmall.css";

export const WrapperSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={baseWrapperSmall}>{children}</div>;
};
