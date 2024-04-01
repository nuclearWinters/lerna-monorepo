import React, { FC } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const baseInput = stylex.create({
  base: {
    borderColor: "rgba(118,118,118,0.3)",
    borderWidth: "1px",
    borderRadius: "8px",
    fontSize: "20px",
    color: "rgb(62,62,62)",
    padding: "6px 6px",
  },
});

export const Input: FC<Props> = (props) => {
  return <input {...stylex.props(baseInput.base)} {...props} />;
};
