import { Button } from "./Button";
import React, { CSSProperties, FC } from "react";
import { useHistory } from "react-router";

interface IProps {
  text: string;
  style?: CSSProperties;
  path: string;
}

export const AuthButton: FC<IProps> = ({ style, text, path }) => {
  const history = useHistory();
  const navigate = (path: string) => {
    history.push(path);
  };
  return (
    <Button
      onClick={() => {
        navigate(path);
      }}
      style={{ ...container, ...style }}
      text={text}
    />
  );
};

const { container }: { container: CSSProperties } = {
  container: {
    cursor: "pointer",
    color: "rgb(245,245,245)",
    fontSize: 18,
    paddingTop: 6,
    paddingBottom: 6,
    textAlign: "center",
    textDecoration: "none",
    backgroundColor: "rgb(0,100,180)",
    borderRadius: 30,
    boxShadow: "1px 2px 5px #888888",
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 20,
    width: 220,
  },
};
