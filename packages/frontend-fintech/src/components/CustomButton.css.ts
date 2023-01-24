import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";
import { baseButton } from "./Button.css";

const customButtonStyles = sprinkles({
  padding: "10px 10px",
  borderRadius: "4px",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  fontSize: "20px",
  alignSelf: "center",
  width: "200px",
});

const authButtonStyles = sprinkles({
  color: "rgb(245, 245, 245)",
  fontSize: "18px",
  paddingTop: "6px",
  paddingBottom: "6px",
  textAlign: "center",
  fontWeight: "bold",
  marginLeft: "20px",
});

export const customButton = styleVariants({
  primary: [
    baseButton,
    customButtonStyles,
    sprinkles({
      backgroundColor: "primary",
    }),
  ],
  secondary: [
    baseButton,
    customButtonStyles,
    sprinkles({
      backgroundColor: "secondary",
    }),
  ],
  logIn: [
    baseButton,
    authButtonStyles,
    sprinkles({
      backgroundColor: "secondary",
    }),
  ],
  signUp: [
    baseButton,
    authButtonStyles,
    sprinkles({
      backgroundColor: "signUp",
    }),
  ],
  warning: [
    baseButton,
    customButtonStyles,
    sprinkles({
      backgroundColor: "warning",
    }),
  ],
});
