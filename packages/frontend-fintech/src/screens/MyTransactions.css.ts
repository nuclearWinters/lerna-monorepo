import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseMyTransactionsIcon = sprinkles({
  fontSize: "18px",
  color: "rgba(255,90,96,0.5)",
  margin: "0px 4px",
  cursor: "pointer",
});

export const baseMyTransactionsBox = sprinkles({
  display: "flex",
  flex: "1",
  flexDirection: "row",
  borderBottom: "1px solid rgb(203,203,203)",
});

export const baseMyTransactionsBar = sprinkles({
  flex: "1",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  margin: "12px 0px",
});

export const baseMyTransactionsStatus = sprinkles({
  fontSize: "18px",
});

export const customMyTransactionsStatus = styleVariants({
  substraction: [
    baseMyTransactionsStatus,
    sprinkles({
      color: "#CD5C5C",
    }),
  ],
  addition: [
    baseMyTransactionsStatus,
    sprinkles({
      color: "#50C878",
    }),
  ],
});

export const baseMyTransactionsQuantity = sprinkles({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: "bold",
});

export const customMyTransactionsQuantity = styleVariants({
  substraction: [
    baseMyTransactionsQuantity,
    sprinkles({
      color: "#CD5C5C",
    }),
  ],
  addition: [
    baseMyTransactionsQuantity,
    sprinkles({
      color: "#50C878",
    }),
  ],
});

export const baseMyTransactionsDescription = sprinkles({
  fontSize: "16px",
  padding: "4px 0px",
});

export const baseMyTransactionsDate = sprinkles({
  letterSpacing: "1px",
});
