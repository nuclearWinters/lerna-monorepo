import * as stylex from "@stylexjs/stylex";
import type { FC } from "react";

interface Props {
  text: string;
  value: string;
}

export const baseTitleAccountValue = stylex.create({
  base: {
    color: "rgb(1,120,221)",
    fontSize: "1.375rem",
    fontWeight: "bold",
    marginTop: "8px",
  },
});

export const baseTitleAccountBox = stylex.create({
  base: {
    borderBottomColor: "rgb(203,203,203)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    textAlign: "center",
    fontSize: "1.625rem",
    padding: "14px 0px",
  },
});

export const TitleAccount: FC<Props> = ({ text, value }) => {
  return (
    <div {...stylex.props(baseTitleAccountBox.base)}>
      {text}
      <div {...stylex.props(baseTitleAccountValue.base)}>{value}</div>
    </div>
  );
};
