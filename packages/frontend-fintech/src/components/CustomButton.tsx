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
      text={text}
      styleX={
        color === "primary"
          ? [button.base, button.custom, button.primary]
          : color === "secondary"
            ? [button.base, button.custom, button.secondary]
            : color === "logIn"
              ? [button.base, button.auth, button.logIn]
              : color === "signUp"
                ? [button.base, button.auth, button.signUp]
                : [button.base, button.custom, button.warning]
      }
    />
  );
};
