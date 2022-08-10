import React, { CSSProperties, FC, ReactNode } from "react";

interface Props {
  color: "primary" | "secondary";
  children: ReactNode;
}

export const Table: FC<Props> = ({ children, color }) => {
  return (
    <div
      style={{
        ...container,
        backgroundColor:
          color === "primary" ? "rgba(255,90,96,0.1)" : "rgba(90,96,255,0.1)",
      }}
    >
      {children}
    </div>
  );
};

const { container }: Record<"container", CSSProperties> = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    margin: "10px 10px",
    backgroundColor: "rgba(255,90,96,0.1)",
    borderRadius: 8,
  },
};
