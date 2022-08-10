import React, { CSSProperties, FC, ReactNode } from "react";

export const WrapperSmall: FC<{ children: ReactNode }> = ({ children }) => {
  return <div style={container}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    backgroundColor: "rgb(255,255,255)",
    margin: "30px 0px",
    borderRadius: 8,
    border: "1px solid rgb(203,203,203)",
    display: "flex",
    flexDirection: "column",
    width: 600,
  },
};
