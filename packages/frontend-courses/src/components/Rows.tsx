import React, { CSSProperties, FC, ReactNode } from "react";

interface Props {
  style?: CSSProperties;
  children: ReactNode;
}

export const Rows: FC<Props> = ({ style, children }) => {
  return <div style={{ ...container, ...style }}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
  },
};
