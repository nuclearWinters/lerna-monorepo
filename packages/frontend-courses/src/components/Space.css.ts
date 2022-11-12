import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const customSpace = styleVariants({
  w50: [
    sprinkles({
      width: "50px",
    }),
  ],
  h30: [
    sprinkles({
      height: "30px",
    }),
  ],
  h20: [
    sprinkles({
      height: "20px",
    }),
  ],
  h10: [
    sprinkles({
      height: "10px",
    }),
  ],
  w20: [
    sprinkles({
      width: "20px",
    }),
  ],
  w30: [
    sprinkles({
      width: "30px",
    }),
  ],
});
