import { keyframes, style } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseSpinnerBox = sprinkles({
  padding: "10px 10px",
  fontSize: "20px",
  width: "200px",
  position: "relative",
  alignSelf: "center",
});

export const baseSpinner = sprinkles({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translateX(-50%) translateY(-50%)",
  zIndex: "1",
  color: "forestgreen",
  fontSize: "18px",
});

export const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const baseSpinnerSpin = style([
  baseSpinner,
  {
    animation: `${rotate} 2s ease infinite`,
  },
]);
