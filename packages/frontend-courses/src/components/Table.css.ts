import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseTable = sprinkles({
  flex: "1",
  display: "flex",
  flexDirection: "row",
  margin: "10px 10px",
  borderRadius: "8px",
});

export const customTable = styleVariants({
  primary: [
    sprinkles({
      backgroundColor: "rgba(255,90,96,0.1)",
    }),
  ],
  default: [
    sprinkles({
      backgroundColor: "rgba(90,96,255,0.1)",
    }),
  ],
});
