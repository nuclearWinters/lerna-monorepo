import React, { CSSProperties, FC } from "react";

interface Props {
  label: string;
}

export const Label: FC<Props> = ({ label }) => {
  return (
    <div style={styles.label}>
      {label} <span style={styles.required}>*</span>
    </div>
  );
};

const styles: Record<"label" | "required", CSSProperties> = {
  label: {
    fontSize: 14,
    color: "rgb(62,62,62)",
    padding: "20px 0px 6px 0px",
  },
  required: {
    fontSize: 14,
    color: "red",
  },
};
