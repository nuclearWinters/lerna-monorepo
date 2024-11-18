import * as stylex from "@stylexjs/stylex";
import type { ChangeEvent, DetailedHTMLProps, FC, InputHTMLAttributes } from "react";

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
}

export const checkboxStyle = stylex.create({
  base: {
    fontSize: "1.25rem",
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
