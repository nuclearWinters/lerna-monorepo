import React, { FC } from "react";

interface Props {
  h?: number;
  w?: number;
}

export const Space: FC<Props> = ({ h, w }) => {
  return <div style={{ height: h, width: w }} />;
};
