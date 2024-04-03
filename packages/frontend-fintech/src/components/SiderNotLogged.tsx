import { FC } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseSider = stylex.create({
  base: {
    gridRowStart: "1",
    gridRowEnd: "3",
    gridColumnStart: "1",
    gridColumnEnd: "1",
    display: "flex",
  },
});

export const SiderNotLogged: FC = () => {
  return <div {...stylex.props(baseSider.base)} />;
};
