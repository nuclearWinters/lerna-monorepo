import * as stylex from "@stylexjs/stylex";
import type { FC } from "react";

interface Props {
  title: string;
  value: string;
  type: "total" | "available";
}

const baseAccountInfoBox = stylex.create({
  base: {
    height: "70px",
    display: "flex",
    borderBottomColor: "rgb(225,225,225)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "8px 0px",
  },
});

const baseAccountInfoTitle = stylex.create({
  base: {
    color: "rgba(62,62,62,0.66)",
    margin: "0px 6px",
  },
});

const baseAccountInfoValue = stylex.create({
  base: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  total: {
    color: "rgb(1,120,221)",
  },
  available: {
    color: "rgb(58,179,152)",
  },
});

export const AccountInfo: FC<Props> = ({ title, value, type }) => {
  return (
    <div {...stylex.props(baseAccountInfoBox.base)}>
      <div {...stylex.props(baseAccountInfoTitle.base)}>{title}</div>
      <div {...stylex.props(baseAccountInfoValue.base, type === "available" ? baseAccountInfoValue.total : baseAccountInfoValue.available)}>{value}</div>
    </div>
  );
};
