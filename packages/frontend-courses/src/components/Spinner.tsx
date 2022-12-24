import React, { FC } from "react";
import { FaSpinner } from "react-icons/fa";
import { baseSpinnerBox, baseSpinnerSpin } from "./Spinner.css";

export const Spinner: FC = () => {
  return (
    <div className={baseSpinnerBox}>
      <FaSpinner className={baseSpinnerSpin} />
    </div>
  );
};
