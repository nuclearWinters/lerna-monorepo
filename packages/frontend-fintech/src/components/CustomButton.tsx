import { Button, button } from "./Button";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

interface IProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  color?: "primary" | "secondary" | "logIn" | "signUp" | "warning";
}

const getStyle = (color: string) => {
  switch (color) {
    case "primary":
      return [button.base, button.custom, button.primary];
    case "secondary":
      return [button.base, button.custom, button.secondary];
    case "logIn":
      return [button.base, button.auth, button.logIn];
    case "signUp":
      return [button.base, button.auth, button.signUp];
    default:
      return [button.base, button.custom, button.warning];
  }
};

export const CustomButton: FC<IProps> = ({
  onClick,
  text,
  color = "primary",
  ...props
}) => {
  return (
    <Button {...props} onClick={onClick} text={text} styleX={getStyle(color)} />
  );
};
