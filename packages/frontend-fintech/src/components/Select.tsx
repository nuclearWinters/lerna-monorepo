import { ChangeEvent, FC } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props {
  name?: string;
  value?: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const baseSelect = stylex.create({
  base: {
    borderColor: "rgba(118,118,118,0.3)",
    borderWidth: "1px",
    borderRadius: "8px",
    fontSize: "20px",
    color: "rgb(62,62,62)",
    padding: "6px 6px",
  },
});

export const Select: FC<Props> = ({ name, value, onChange, options }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      {...stylex.props(baseSelect.base)}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
