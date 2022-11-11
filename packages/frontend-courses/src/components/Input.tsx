import React, { FC } from "react";
import { baseInput } from "./Input.css";

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
}

export const Input: FC<Props> = ({
  onChange,
  onBlur,
  value,
  name,
  placeholder,
  disabled,
}) => {
  return (
    <input
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      className={baseInput}
      disabled={disabled}
    />
  );
};
