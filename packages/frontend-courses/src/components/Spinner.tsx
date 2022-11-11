import React, { FC } from "react";
import { FaSpinner } from "react-icons/fa";
import { baseSpinnerBox, baseSpinner } from "./Spinner.css";

export const Spinner: FC = () => {
  return (
    <div className={baseSpinnerBox}>
      <FaSpinner className={baseSpinner} />
    </div>
  );
};
