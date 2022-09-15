import React, { CSSProperties, FC } from "react";
import { FaSpinner } from "react-icons/fa";

export const Spinner: FC = () => {
  return (
    <div style={container}>
      <FaSpinner
        color="rgb(203,203,203)"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 1,
          backgroundColor: "forestgreen",
        }}
        size={18}
      />
    </div>
  );
};

const { container }: { container: CSSProperties } = {
  container: {
    padding: "10px 10px",
    fontSize: "20px",
    width: 200,
    position: "relative",
    alignSelf: "center",
  },
};
