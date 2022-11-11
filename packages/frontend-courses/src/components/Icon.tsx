import React, { FC } from "react";
import logo from "assets/logo.png";
import { baseIconBox, baseIconImg } from "./Icon.css";

export const Icon: FC = () => {
  return (
    <div className={baseIconBox}>
      <img src={logo} alt="presta dinero" className={baseIconImg} />
    </div>
  );
};
