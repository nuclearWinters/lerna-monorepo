import * as stylex from "@stylexjs/stylex";
import type { FC } from "react";
import FaPlusCircle from "../assets/circle-plus-solid.svg";

interface Props {
  text: string;
  value: string;
  type?: "available";
}

export const accountRowBox = stylex.create({
  base: {
    display: "flex",
    borderBottomColor: "rgb(203,203,203)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    fontSize: "1.25rem",
    padding: "14px 0px",
    justifyContent: "space-between",
    flex: "1",
    position: "relative",
  },
});

export const accountRowIcon = stylex.create({
  base: {
    color: "rgb(203,203,203)",
    position: "absolute",
    bottom: "-10px",
    right: "10px",
    backgroundColor: "white",
    height: "1rem",
  },
});

export const accountRowValue = stylex.create({
  base: {
    color: "black",
    fontWeight: "bold",
    fontSize: "1.125rem",
  },
  available: {
    color: "rgb(58,179,152)",
  },
});

export const AccountRow: FC<Props> = ({ text, value, type }) => {
  return (
    <div {...stylex.props(accountRowBox.base)}>
      <div>{text}</div>
      <div {...stylex.props(accountRowValue.base, type ? accountRowValue.available : undefined)}>{value}</div>
      <FaPlusCircle {...stylex.props(accountRowIcon.base)} />
    </div>
  );
};
