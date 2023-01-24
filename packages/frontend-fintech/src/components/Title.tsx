import React, { FC } from "react";
import { baseTitle } from "./Title.css";

interface Props {
  text: string;
}

export const Title: FC<Props> = ({ text }) => {
  return <div className={baseTitle}>{text}</div>;
};
