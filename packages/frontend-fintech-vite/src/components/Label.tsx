import { FC } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props {
  label: string;
}

export const baseLabel = stylex.create({
  base: {
    fontSize: "0.875rem",
    color: "rgb(62,62,62)",
    padding: "20px 0px 6px 0px",
    margin: "0px 14px",
  },
});

export const baseRequired = stylex.create({
  base: {
    fontSize: "0.875rem",
    color: "red",
  },
});

export const Label: FC<Props> = ({ label }) => {
  return (
    <div {...stylex.props(baseLabel.base)}>
      {label} <span {...stylex.props(baseRequired.base)}>*</span>
    </div>
  );
};
