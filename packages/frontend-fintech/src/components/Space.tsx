import { FC } from "react";
import * as stylex from "@stylexjs/stylex";

interface Props {
  styleX?: stylex.StaticStyles;
}

export const customSpace = stylex.create({
  w50: {
    width: "50px",
  },
  h30: {
    height: "30px",
  },
  h20: {
    height: "20px",
  },
  h10: {
    height: "10px",
  },
  w20: {
    width: "20px",
  },
  w30: {
    width: "30px",
  },
});

export const Space: FC<Props> = ({ styleX }) => {
  return <div {...stylex.props(styleX)} />;
};
