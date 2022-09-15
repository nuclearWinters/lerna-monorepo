import React, { CSSProperties, FC } from "react";
import { FaPlusCircle } from "react-icons/fa";

interface Props {
  text: string;
  value: string;
  color?: string;
}

export const AccountRow: FC<Props> = ({ text, value, color }) => {
  return (
    <div style={container}>
      <div>{text}</div>
      <div
        style={{ color: color ?? "black", fontWeight: "bold", fontSize: 18 }}
      >
        {value}
      </div>
      <FaPlusCircle
        color="rgb(203,203,203)"
        style={{
          position: "absolute",
          bottom: -10,
          right: 10,
          backgroundColor: "white",
        }}
        size={18}
      />
    </div>
  );
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgb(203,203,203)",
    fontSize: 20,
    padding: "14px 0px",
    justifyContent: "space-between",
    flex: 1,
    position: "relative",
  },
};
