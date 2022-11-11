import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseColumn = sprinkles({
  display: "flex",
});

export const columnJustifyCenter = sprinkles({
  justifyContent: "center",
});

export const columnLoanRow = sprinkles({
  marginBottom: "6px",
});

export const customColumn = styleVariants({
  columnJustifyCenter: [baseColumn, columnJustifyCenter],
  columnLoanRow: [baseColumn, columnLoanRow],
});
