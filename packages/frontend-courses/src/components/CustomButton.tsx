import { Button } from "./Button";
import React, { CSSProperties, FC } from "react";

interface IProps {
  onClick: () => void;
  text: string;
  style?: CSSProperties;
  color?: "primary" | "secondary" | "warning";
}

export const CustomButton: FC<IProps> = ({
  onClick,
  style,
  text,
  color = "primary",
}) => {
  return (
    <Button
      onClick={onClick}
      style={{
        ...container,
        ...style,
        backgroundColor:
          color === "primary"
            ? "rgb(0,100,180)"
            : color === "secondary"
            ? "#1bbc9b"
            : "rgb(130,130,130)",
      }}
      text={text}
    />
  );
};

const { container }: { container: CSSProperties } = {
  container: {
    padding: "10px 10px",
    backgroundColor: "rgb(0,100,180)",
    borderRadius: "4px",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
    cursor: "pointer",
    alignSelf: "center",
    width: 200,
  },
};
