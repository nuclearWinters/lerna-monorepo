import React, { CSSProperties, FC } from "react";

export const TableColumnName: FC = ({ children }) => {
  return <div style={container}>{children}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    flex: 1,
    textAlign: "center",
    color: "rgb(62,62,62)",
    padding: "4px 0px",
  },
};
