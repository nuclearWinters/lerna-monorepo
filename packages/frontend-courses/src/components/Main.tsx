import React, { FC, ReactNode } from "react";
import { baseMain } from "./Main.css";

export const Main: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={baseMain}>{children}</div>;
};
