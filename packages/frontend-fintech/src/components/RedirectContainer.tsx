import { FC, useEffect } from "react";
//import { useNavigate } from "react-router-dom";

export const RedirectContainer: FC<{
  allowed: ("borrower" | "lender" | "support")[];
  isSupport: boolean;
  isLender: boolean;
  isBorrower: boolean;
}> = ({ allowed, isBorrower, isLender, isSupport }) => {
  //const navigate = useNavigate();
  const navigate = (path: string) => path;
  useEffect(() => {
    const isAllowed =
      (allowed.includes("borrower") && isBorrower) ||
      (allowed.includes("lender") && isLender) ||
      (allowed.includes("support") && isSupport);
    if (!isAllowed) {
      if (isBorrower) {
        navigate("/myLoans");
      } else if (isSupport) {
        navigate("/approveLoan");
      } else {
        navigate("/addInvestments");
      }
    }
  });
  return null;
};
