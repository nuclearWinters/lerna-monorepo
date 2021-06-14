import React, { CSSProperties, FC, useState } from "react";
import { useSpring, animated } from "react-spring";

const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export const Spinner: FC = () => {
  const forceUpdate = useForceUpdate();
  const style = useSpring({
    to: {
      height: 40,
      opacity: 0,
      width: 40,
    },
    from: {
      border: "10px solid forestgreen",
      borderRadius: "100%",
      height: 0,
      left: "50%",
      opacity: 1,
      position: "absolute",
      top: "50%",
      transform: "translateX(-50%) translateY(-50%)",
      width: 0,
      zIndex: 1,
    },
    reset: true,
    onRest: forceUpdate,
  });
  return (
    <div style={container}>
      <animated.div style={style} />
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
