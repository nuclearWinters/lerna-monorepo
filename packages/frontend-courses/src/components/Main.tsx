import React, { CSSProperties, FC } from "react";

export const Main: FC = ({ children }) => {
  return <div style={container}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    backgroundColor: "rgb(248,248,248)",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
};
