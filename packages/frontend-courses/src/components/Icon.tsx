import React, { FC } from "react";
import logo from "assets/logo.png";

export const Icon: FC = () => {
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
