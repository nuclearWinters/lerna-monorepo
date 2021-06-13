import React, { CSSProperties, FC } from "react";

interface Props {
  style?: CSSProperties;
}

export const Columns: FC<Props> = ({ style, children }) => {
  return <div style={{ ...container, ...style }}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    display: "flex",
  },
};
