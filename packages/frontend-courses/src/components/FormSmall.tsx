import React, { CSSProperties, FC } from "react";

export const FormSmall: FC = ({ children }) => {
  return <div style={container}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    alignSelf: "center",
    width: 500,
    flexDirection: "column",
    overflowY: "scroll",
  },
};
