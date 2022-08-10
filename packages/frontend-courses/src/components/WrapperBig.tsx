import React, { CSSProperties, FC, ReactNode } from "react";

interface Props {
  style?: CSSProperties;
  children: ReactNode;
}

export const WrapperBig: FC<Props> = ({ children, style }) => {
  return <div style={{ ...container, ...style }}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    backgroundColor: "rgb(255,255,255)",
    margin: "30px 20px",
    borderRadius: 8,
    border: "1px solid rgb(203,203,203)",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
};
