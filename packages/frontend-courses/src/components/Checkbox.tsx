import React, { CSSProperties, FC } from "react";

interface Props {
  value?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
}

export const Checkbox: FC<Props> = ({ onChange, value, label, name }) => {
  return (
    <label style={container}>
      {label}
      <input name={name} type="checkbox" checked={value} onChange={onChange} />
    </label>
  );
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    fontSize: 20,
    color: "rgb(62,62,62)",
  },
};
