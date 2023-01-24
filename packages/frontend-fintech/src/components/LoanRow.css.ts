import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseLoanRowIcon = sprinkles({
  fontSize: "18px",
  color: "rgb(255,90,96)",
});

export const baseLoanRowBorrowerIconBox = sprinkles({
  width: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const baseLoanRowBorrowerIcon = sprinkles({
  fontSize: "18px",
  color: "rgb(62,62,62)",
  cursor: "pointer",
  backgroundColor: "rgb(245,245,245)",
});

export const baseLoanRowCell = sprinkles({
  flex: "1",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "white",
  padding: "10px 0px",
  textAlign: "center",
  color: "#333",
});

export const baseLoanRowInputBox = sprinkles({
  flex: "1",
  backgroundColor: "white",
  alignItems: "center",
  color: "#333",
  display: "flex",
});

export const baseLoanRowInput = sprinkles({
  margin: "4px",
  border: "1px solid #999",
  borderRadius: "4px",
  padding: "4px",
  width: "100%",
});

export const baseLoanRowClipboard = sprinkles({
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

export const baseLoanRowScore = sprinkles({
  flex: "1",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "white",
  textAlign: "center",
  color: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const baseLoanRowScoreCircle = sprinkles({
  borderRadius: "100%",
  backgroundColor: "rgb(102,141,78)",
  width: "30px",
  height: "30px",
  fontSize: "10px",
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const baseLoanRowContainer = sprinkles({
  display: "flex",
  flexDirection: "row",
  marginBottom: "8px",
});

export const baseLoanRowStatus = sprinkles({
  flex: "1",
  backgroundColor: "white",
  color: "#333",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const baseLoanRowStatusBox = sprinkles({
  margin: "4px",
  borderRadius: "4px",
  textAlign: "center",
  flex: "1",
  padding: "3px 0px",
  color: "white",
});

export const customLoanRowStatusBox = styleVariants({
  financing: [
    baseLoanRowStatusBox,
    sprinkles({
      backgroundColor: "#4F7942",
    }),
  ],
  default: [
    baseLoanRowStatusBox,
    sprinkles({
      backgroundColor: "#FF9F00",
    }),
  ],
  scheduledPaymentsDelayed: [
    baseLoanRowStatusBox,
    sprinkles({
      backgroundColor: "#FF9F00",
      maxWidth: "200px",
    }),
  ],
  scheduledPaymentsPaid: [
    baseLoanRowStatusBox,
    sprinkles({
      backgroundColor: "#44d43b",
      maxWidth: "200px",
    }),
  ],
  scheduledPaymentsToBePaid: [
    baseLoanRowStatusBox,
    sprinkles({
      backgroundColor: "#046307",
      maxWidth: "200px",
    }),
  ],
  scheduledPaymentsDefault: [
    baseLoanRowStatusBox,
    sprinkles({
      backgroundColor: "white",
      maxWidth: "200px",
    }),
  ],
});
