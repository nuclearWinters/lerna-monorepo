import React, { CSSProperties, FC } from "react";

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
      style={container}
      disabled={disabled}
    />
  );
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    borderColor: "rgba(118,118,118,0.3)",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    color: "rgb(62,62,62)",
    padding: "6px 6px",
  },
};
