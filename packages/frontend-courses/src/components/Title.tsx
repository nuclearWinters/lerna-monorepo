import React, { CSSProperties, FC } from "react";

interface Props {
  text: string;
}

export const Title: FC<Props> = ({ text }) => {
  return <div style={container}>{text}</div>;
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    borderBottom: "1px solid rgb(203,203,203)",
    textAlign: "center",
    fontSize: 26,
    padding: "14px 0px",
  },
};
