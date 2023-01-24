import React, { FC, ReactNode } from "react";
import { baseWrapperBig } from "./WrapperBig.css";

interface Props {
  className?: string;
  children: ReactNode;
}

export const WrapperBig: FC<Props> = ({ children, className }) => {
  return <div className={className || baseWrapperBig}>{children}</div>;
};
