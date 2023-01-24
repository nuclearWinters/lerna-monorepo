import React, { FC, ReactNode } from "react";
import { baseButton } from "./Button.css";

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button: FC<IProps> = ({
  text,
  iconLeft,
  iconRight,
  className,
  ...props
}) => {
  return (
    <button {...props} className={className || baseButton}>
      {iconLeft ? iconLeft : null}
      {!!text && text}
      {iconRight ? iconRight : null}
    </button>
  );
};
