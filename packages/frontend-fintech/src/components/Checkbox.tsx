import React, { FC } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
}

export const checkboxStyle = stylex.create({
  base: {
    fontSize: "20px",
    color: "rgb(62,62,62)",
  },
});

export const Checkbox: FC<Props> = ({ label, name, ...props }) => {
  return (
    <label {...stylex.props(checkboxStyle.base)}>
      {label}
      <input name={name} type="checkbox" {...props} />
    </label>
  );
};
