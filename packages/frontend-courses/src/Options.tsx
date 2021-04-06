import React, { useEffect, useState } from "react";

export const Options = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(!show);
  }, []);
  return <h1>Hello world React! Hola Hot Reload Working</h1>;
};
