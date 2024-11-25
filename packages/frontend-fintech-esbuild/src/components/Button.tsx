import * as stylex from "@stylexjs/stylex";
import type { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode } from "react";

interface IProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  styleX?: stylex.StyleXStyles[];
}

export const button = stylex.create({
  base: {
    cursor: "pointer",
    textDecoration: "none",
    borderRadius: "30px",
    boxShadow: "1px 2px 5px #888888",
    letterSpacing: "1px",
    width: "220px",
    borderWidth: "none",
    borderColor: "none",
    borderStyle: "none",
  },
  custom: {
    padding: "10px 10px",
    borderRadius: "4px",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.25rem",
    alignSelf: "center",
    width: {
      default: "200px",
      "@media (max-width: 500px)": "100px",
    },
  },
  auth: {
    color: "rgb(245, 245, 245)",
    fontSize: "1.125rem",
    paddingTop: "6px",
    paddingBottom: "6px",
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: "20px",
  },
  primary: {
    backgroundColor: "rgb(0, 100, 180)",
  },
  secondary: {
    backgroundColor: "#1bbc9b",
  },
  logIn: {
    backgroundColor: "#1bbc9b",
  },
  signUp: {
    backgroundColor: "#2c92db",
  },
  warning: {
    backgroundColor: "rgb(130, 130, 130)",
  },
});

export const Button: FC<IProps> = ({ text, iconLeft, iconRight, styleX, ...props }) => {
  return (
    <button {...stylex.props(styleX || button.base)} {...props}>
      {iconLeft ? iconLeft : null}
      {!!text && text}
      {iconRight ? iconRight : null}
    </button>
  );
};
