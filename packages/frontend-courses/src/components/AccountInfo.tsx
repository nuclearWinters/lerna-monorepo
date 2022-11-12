import React, { FC } from "react";
import {
  baseAccountInfoBox,
  baseAccountInfoTitle,
  baseAccountInfoValue,
} from "./AccountInfo.css";

interface Props {
  title: string;
  value: string;
  className: string;
}

export const AccountInfo: FC<Props> = ({ title, value, className }) => {
  return (
    <div className={baseAccountInfoBox}>
      <div className={baseAccountInfoTitle}>{title}</div>
      <div className={className || baseAccountInfoValue}>{value}</div>
    </div>
  );
};
