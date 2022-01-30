import React, { FC, useEffect, useRef } from "react";
import logo from "assets/logo.png";
import { useNavigate } from "react-router";

interface Props {
  isLogged: boolean;
  isBorrower: boolean;
  isSupport: boolean;
}

export const Icon: FC<Props> = ({ isLogged, isBorrower, isSupport }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => {
    if (isLogged && isBorrower) {
      navigateRef.current("/myLoans");
    } else if (isLogged && isSupport) {
      navigateRef.current("/approveLoan");
    } else if (isLogged) {
      navigateRef.current("/addInvestments");
    } else {
      navigateRef.current("/login");
    }
  }, [isLogged, isBorrower, isSupport, navigateRef]);
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid rgb(225,225,225)",
        flexDirection: "column",
      }}
    >
      <img
        src={logo}
        alt="presta dinero"
        style={{
          height: 70,
          alignSelf: "center",
        }}
      />
    </div>
  );
};
