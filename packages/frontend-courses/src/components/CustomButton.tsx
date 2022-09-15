import { Button } from "./Button";
import React, { FC } from "react";
import { cx, LinariaClassName } from "@linaria/core";
import { css } from "@linaria/atomic";

interface IProps {
  onClick: () => void;
  text: string;
  className?: LinariaClassName;
  color?: "primary" | "secondary" | "warning";
}

const primary = css`
  background-color: rgb(0, 100, 180);
`;

const secondary = css`
  background-color: #1bbc9b;
`;

const warning = css`
  background-color: rgb(130, 130, 130);
`;

const container = css`
  padding: 10px 10px;
  border-radius: 4px;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  align-self: center;
  width: 200px;
`;

export const CustomButton: FC<IProps> = ({
  onClick,
  className,
  text,
  color = "primary",
}) => {
  return (
    <Button
      onClick={onClick}
      className={cx(
        container,
        color === "primary"
          ? primary
          : color === "secondary"
          ? secondary
          : warning,
        className
      )}
      text={text}
    />
  );
};
