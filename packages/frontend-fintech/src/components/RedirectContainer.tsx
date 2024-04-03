import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDataCache } from "../utils";

export const RedirectContainer = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = getUserDataCache();
    if (userData) {
      if (userData.isBorrower) {
        navigate("/myLoans");
      } else if (userData.isSupport) {
        navigate("/approveLoan");
      } else {
        navigate("/addInvestments");
      }
    }
  });
  return null;
};
