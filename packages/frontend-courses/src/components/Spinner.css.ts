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
  backgroundColor: "forestgreen",
  fontSize: "18px",
  color: "rgb(203,203,203)",
});
