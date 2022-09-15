import { Button } from "./Button";
import React, { FC } from "react";
import { useNavigate } from "react-router";
import { css } from "@linaria/atomic";
import { cx, LinariaClassName } from "@linaria/core";

const container = css`
  color: rgb(245, 245, 245);
  font-size: 18px;
  padding-top: 6px;
  padding-bottom: 6px;
  text-align: center;
  background-color: rgb(0, 100, 180);
  font-weight: bold;
  margin-left: 20px;
`;

interface IProps {
  text: string;
  className?: LinariaClassName;
  path: string;
}

export const AuthButton: FC<IProps> = ({ text, path, className }) => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => {
    navigate(path);
  };
  return (
    <Button
      onClick={() => {
        navigateTo(path);
      }}
      className={cx(container, className)}
      text={text}
    />
  );
};
