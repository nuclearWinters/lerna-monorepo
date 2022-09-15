import React, { FC, ReactNode } from "react";
import { cx, LinariaClassName } from "@linaria/core";
import { css } from "@linaria/atomic";

interface IProps {
  className?: LinariaClassName;
  onClick: () => void;
  text: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const container = css`
  cursor: pointer;
  text-decoration: none;
  border-radius: 30px;
  box-shadow: 1px 2px 5px #888888;
  letter-spacing: 1px;
  width: 220px;
  border: none;
`;

export const Button: FC<IProps> = ({
  text,
  className,
  onClick,
  iconLeft,
  iconRight,
}) => {
  return (
    <button className={cx(container, className)} onClick={onClick}>
      {iconLeft ? iconLeft : null}
      {!!text && text}
      {iconRight ? iconRight : null}
    </button>
  );
};
