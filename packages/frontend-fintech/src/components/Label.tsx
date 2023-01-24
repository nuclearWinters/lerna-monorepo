import React, { FC } from "react";
import { baseLabel, baseRequired } from "./Label.css";

interface Props {
  label: string;
}

export const Label: FC<Props> = ({ label }) => {
  return (
    <div className={baseLabel}>
      {label} <span className={baseRequired}>*</span>
    </div>
  );
};
