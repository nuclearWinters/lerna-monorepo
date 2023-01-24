import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseAccountInfoBox = sprinkles({
  height: "70px",
  display: "flex",
  borderBottom: "1px solid rgb(225,225,225)",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export const baseAccountInfoValue = sprinkles({
  fontSize: "16px",
  fontWeight: "bold",
});

export const baseAccountInfoTitle = sprinkles({
  color: "rgba(62,62,62,0.66)",
  margin: "0px 6px",
});

export const customAccountInfo = styleVariants({
  total: [
    baseAccountInfoValue,
    sprinkles({
      color: "rgb(1,120,221)",
    }),
  ],
  available: [
    baseAccountInfoValue,
    sprinkles({
      color: "rgb(58,179,152)",
    }),
  ],
});
