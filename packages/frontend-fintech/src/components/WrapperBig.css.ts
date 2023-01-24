import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseWrapperBig = sprinkles({
  backgroundColor: "white",
  margin: "30px 20px",
  borderRadius: "8px",
  border: "1px solid rgb(203,203,203)",
  display: "flex",
  flexDirection: "column",
  flex: "1",
});

export const customWrapperBig = styleVariants({
  settings: [
    baseWrapperBig,
    sprinkles({
      margin: "30px 60px",
    }),
  ],
});
