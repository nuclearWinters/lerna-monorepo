import React, { FC, ReactNode } from "react";
import { baseFormSmall } from "./FormSmall.css";

export const FormSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={baseFormSmall}>{children}</div>;
};
