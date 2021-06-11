import React, { FC, useEffect } from "react";
import logo from "assets/logo.png";
import { useHistory } from "react-router";

interface Props {
  isLogged: boolean;
  isBorrower: boolean;
  isSupport: boolean;
}

export const Icon: FC<Props> = ({ isLogged, isBorrower, isSupport }) => {
  const history = useHistory();
  useEffect(() => {
    if (isLogged && isBorrower) {
      history.push("/myLoans");
    } else if (isLogged && isSupport) {
      history.push("/approveLoan");
    } else if (isLogged) {
      history.push("/addInvestments");
    } else {
      history.push("/login");
    }
  }, [isLogged, isBorrower, isSupport, history]);
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
