import React, { CSSProperties, FC } from "react";
import { useSpring, animated } from "react-spring";

export const Spinner: FC = () => {
  const style = useSpring({
    to: {
      height: 40,
      opacity: 0,
      width: 40,
    },
    from: {
      height: 0,
      opacity: 1,
      width: 0,
    },
    loop: true,
  });
  return (
    <div style={container}>
      <animated.div
        style={{
          position: "absolute",
          border: "10px solid forestgreen",
          borderRadius: "100%",
          left: "50%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 1,
          ...style,
        }}
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
