import React, { FC } from "react";
import { baseTitleAccountBox, baseTitleAccountValue } from "./TitleAccount.css";

interface Props {
  text: string;
  value: string;
}

export const TitleAccount: FC<Props> = ({ text, value }) => {
  return (
    <div className={baseTitleAccountBox}>
      {text}
      <div className={baseTitleAccountValue}>{value}</div>
    </div>
  );
};
