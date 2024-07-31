import { FC } from "react";
import logo from "../assets/logo.png";
import * as stylex from "@stylexjs/stylex";

export const baseIconImg = stylex.create({
  base: {
    height: "70px",
    alignSelf: "center",
  },
});

export const baseIconBox = stylex.create({
  base: {
    display: "flex",
    flexDirection: "column",
    borderBottomColor: "rgb(225,225,225)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    width: "100%",
  },
});

export const Icon: FC = () => {
  return (
    <div {...stylex.props(baseIconBox.base)}>
      <img src={logo} alt="presta dinero" {...stylex.props(baseIconImg.base)} />
    </div>
  );
};
