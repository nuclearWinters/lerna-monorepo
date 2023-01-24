import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseRows = sprinkles({
  display: "flex",
  flexDirection: "column",
});

export const customRows = styleVariants({
  flex1: [
    baseRows,
    sprinkles({
      flex: "1",
    }),
  ],
  lender: [
    baseRows,
    sprinkles({
      width: "300px",
    }),
  ],
  transactions: [
    baseRows,
    sprinkles({
      flex: "1",
      margin: "0px 12px",
    }),
  ],
});
