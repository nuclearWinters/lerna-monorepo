import React, { FC } from "react";
import { FaPlusCircle } from "react-icons/fa";
import {
  baseAccountRowBox,
  baseAccountRowIcon,
  baseAccountRowValue,
} from "./AccountRow.css";

interface Props {
  text: string;
  value: string;
  className?: string;
}

export const AccountRow: FC<Props> = ({ text, value, className }) => {
  return (
    <div className={baseAccountRowBox}>
      <div>{text}</div>
      <div className={className || baseAccountRowValue}>{value}</div>
      <FaPlusCircle className={baseAccountRowIcon} />
    </div>
  );
};
