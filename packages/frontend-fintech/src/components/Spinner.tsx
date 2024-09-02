import { FC } from "react";
import FaSpinner from "../assets/spinner-solid.svg";
import * as stylex from "@stylexjs/stylex";

export const baseSpinnerBox = stylex.create({
  base: {
    padding: "10px 10px",
    fontSize: "20px",
    width: "200px",
    position: "relative",
    alignSelf: "center",
  },
});

const rotate = stylex.keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const baseSpinnerSpin = stylex.create({
  base: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: "1",
    color: "forestgreen",
    height: "18px",
    animationName: rotate,
    animationDuration: "2s",
    animationIterationCount: "infinite",
  },
});

export const Spinner: FC = () => {
  return (
    <div {...stylex.props(baseSpinnerBox.base)}>
      <img src={FaSpinner} {...stylex.props(baseSpinnerSpin.base)} />
    </div>
  );
};
