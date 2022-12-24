import React, { FC } from "react";
import { baseInput } from "./Input.css";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Input: FC<Props> = (props) => {
  return <input className={baseInput} {...props} />;
};
