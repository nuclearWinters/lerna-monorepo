import React, { useEffect, useState } from "react";

export const Options = () => {
  const [, setShow] = useState(true);
  useEffect(() => {
    setShow((state) => !state);
  }, []);
  return <h1>Hello world React! Hola Hot Reload Working</h1>;
};
