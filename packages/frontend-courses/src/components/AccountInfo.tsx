import React, { FC } from "react";

interface Props {
  title: string;
  value: string;
  colorValue: string;
}

export const AccountInfo: FC<Props> = ({ title, value, colorValue }) => {
  return (
    <div
      style={{
        height: 70,
        display: "flex",
        borderBottom: "1px solid rgb(225,225,225)",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ color: "rgba(62,62,62,0.66)", margin: "0px 6px" }}>
        {title}
      </div>
      <div style={{ color: colorValue, fontSize: 16, fontWeight: "bold" }}>
        ${value}
      </div>
    </div>
  );
};
