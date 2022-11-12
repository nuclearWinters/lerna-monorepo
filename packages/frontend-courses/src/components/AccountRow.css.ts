import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseAccountRowBox = sprinkles({
  display: "flex",
  borderBottom: "1px solid rgb(203,203,203)",
  fontSize: "20px",
  padding: "14px 0px",
  justifyContent: "space-between",
  flex: "1",
  position: "relative",
});

export const baseAccountRowIcon = sprinkles({
  color: "rgb(203,203,203)",
  position: "absolute",
  bottom: "-10px",
  right: "10px",
  backgroundColor: "white",
  fontSize: "18px",
});

export const baseAccountRowValue = sprinkles({
  color: "black",
  fontWeight: "bold",
  fontSize: "18px",
});

export const customAccountInfo = styleVariants({
  available: [
    baseAccountRowValue,
    sprinkles({
      color: "rgb(58,179,152)",
    }),
  ],
});
