import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseAccountLinkBox = sprinkles({
  height: "80px",
  display: "flex",
  borderBottom: "1px solid rgb(225,225,225)",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  cursor: "pointer",
});

export const customAccountLinkBox = styleVariants({
  selected: [
    baseAccountLinkBox,
    sprinkles({
      backgroundColor: "rgba(221,221,221,0.48)",
      boxShadow: "rgba(134,134,134,0.75) 0px 1px 7px 0px inset",
    }),
  ],
  notSelected: [
    baseAccountLinkBox,
    sprinkles({
      backgroundColor: "white",
      boxShadow: "unset",
    }),
  ],
});

export const baseAccountLinkIcon = sprinkles({
  position: "absolute",
  left: "0px",
  top: "0px",
  bottom: "0px",
  width: "4px",
  backgroundColor: "rgb(255,90,96)",
});

export const baseAccountInfoTitle = sprinkles({
  fontSize: "16px",
});

export const customAccountLinkTitle = styleVariants({
  selected: [
    baseAccountInfoTitle,
    sprinkles({
      color: "rgb(255,90,96)",
    }),
  ],
  notSelected: [
    baseAccountInfoTitle,
    sprinkles({
      color: "rgb(62,62,62)",
    }),
  ],
});
