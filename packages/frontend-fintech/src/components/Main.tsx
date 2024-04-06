import { FC, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";

export const baseMain = stylex.create({
  base: {
    backgroundColor: "rgb(248,248,248)",
    flex: "1",
    display: "flex",
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "3",
    overflow: "scroll",
    position: "relative",
  },
  notLogged: {
    gridColumnStart: "1",
    gridColumnEnd: "3",
  },
});

export const baseMainBlock = stylex.create({
  base: {
    display: "block",
    overflowX: "hidden",
    width: "100%",
  },
});

export const Main: FC<{ children: ReactNode; notLogged?: boolean }> = ({
  children,
  notLogged,
}) => {
  return (
    <div
      {...stylex.props(
        baseMain.base,
        notLogged ? baseMain.notLogged : undefined
      )}
    >
      <div {...stylex.props(baseMainBlock.base)}>{children}</div>
    </div>
  );
};
