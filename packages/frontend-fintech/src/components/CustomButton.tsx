import { Button } from "./Button";
import React, { FC } from "react";
import { customButton } from "./CustomButton.css";

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  color?: keyof typeof customButton;
}

export const CustomButton: FC<IProps> = ({
  onClick,
  text,
  color = "primary",
  ...props
}) => {
  return (
    <Button
      {...props}
      onClick={onClick}
      className={customButton[color]}
      text={text}
    />
  );
};
