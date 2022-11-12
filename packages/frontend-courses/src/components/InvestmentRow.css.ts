import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseInvestmentRowBox = sprinkles({
  display: "flex",
  flexDirection: "row",
  marginBottom: "8px",
});

export const baseInvestmentRowClipboard = sprinkles({
  flex: "1",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "white",
  padding: "10px 0px",
  textAlign: "center",
  color: "#333",
  cursor: "pointer",
});

export const baseInvestmentRowCell = sprinkles({
  flex: "1",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "white",
  padding: "10px 0px",
  textAlign: "center",
  color: "#333",
});

export const baseInvestmentRowStatus = sprinkles({
  flex: "1",
  backgroundColor: "white",
  color: "#333",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const baseInvestmentRowIcon = sprinkles({
  fontSize: "18px",
  color: "rgb(90,96,255)",
});

export const baseInvestmentRowStatusBar = sprinkles({
  margin: "4px",
  borderRadius: "4px",
  textAlign: "center",
  flex: "1",
  padding: "3px 0px",
  color: "white",
});

export const customInvestmentRowStatusBar = styleVariants({
  delayPayment: [
    baseInvestmentRowStatusBar,
    sprinkles({
      backgroundColor: "#FF9F00",
    }),
  ],
  financing: [
    baseInvestmentRowStatusBar,
    sprinkles({
      backgroundColor: "#4F7942",
    }),
  ],
  paid: [
    baseInvestmentRowStatusBar,
    sprinkles({
      backgroundColor: "#046307",
    }),
  ],
  pastDue: [
    baseInvestmentRowStatusBar,
    sprinkles({
      backgroundColor: "#CA3435",
    }),
  ],
  upToDate: [
    baseInvestmentRowStatusBar,
    sprinkles({
      backgroundColor: "#44d43b",
    }),
  ],
  default: [
    baseInvestmentRowStatusBar,
    sprinkles({
      backgroundColor: "white",
    }),
  ],
});
