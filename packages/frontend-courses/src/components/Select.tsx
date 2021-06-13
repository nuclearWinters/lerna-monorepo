import React, { CSSProperties, FC } from "react";

interface Props {
  name?: string;
  value?: string;
  style?: CSSProperties;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: FC<Props> = ({
  name,
  value,
  onChange,
  options,
  style,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{ ...container, ...style }}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
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
