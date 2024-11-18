import { type FC, useEffect } from "react";
import { historyReplace } from "../react-router-elements/utils";

export const RedirectContainer: FC<{
  allowed: ("borrower" | "lender" | "support")[];
  isSupport: boolean;
  isLender: boolean;
  isBorrower: boolean;
}> = ({ allowed, isBorrower, isLender, isSupport }) => {
  useEffect(() => {
    const isAllowed = (allowed.includes("borrower") && isBorrower) || (allowed.includes("lender") && isLender) || (allowed.includes("support") && isSupport);
    if (!isAllowed) {
      if (isBorrower) {
        historyReplace("/myLoans");
      } else if (isSupport) {
        historyReplace("/approveLoan");
      } else {
        historyReplace("/addInvestments");
      }
    }
  });
  return null;
};
