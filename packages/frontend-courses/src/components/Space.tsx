import React, { FC } from "react";

interface Props {
  className?: string;
}

export const Space: FC<Props> = ({ className }) => {
  return <div className={className} />;
};
