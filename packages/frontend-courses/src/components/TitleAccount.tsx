import React, { CSSProperties, FC } from "react";

interface Props {
  text: string;
  value: string;
}

export const TitleAccount: FC<Props> = ({ text, value }) => {
  return (
    <div style={container}>
      {text}
      <div
        style={{
          color: "rgb(1,120,221)",
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 8,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    borderBottom: "1px solid rgb(203,203,203)",
    textAlign: "center",
    fontSize: 26,
    padding: "14px 0px",
  },
};
