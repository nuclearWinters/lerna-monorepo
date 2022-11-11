import React, { FC } from "react";
import { checkboxStyle } from "./Checkbox.css";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
}

export const Checkbox: FC<Props> = ({ label, name, ...props }) => {
  return (
    <label className={checkboxStyle}>
      {label}
      <input name={name} type="checkbox" {...props} />
    </label>
  );
};
