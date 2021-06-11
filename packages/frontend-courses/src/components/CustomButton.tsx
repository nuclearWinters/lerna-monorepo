import { Button } from "./Button";
import React, { CSSProperties, FC } from "react";

interface IProps {
  onClick: () => void;
  text: string;
  style?: CSSProperties;
}

export const CustomButton: FC<IProps> = ({ onClick, style, text }) => {
  return (
    <Button onClick={onClick} style={{ ...container, ...style }} text={text} />
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
