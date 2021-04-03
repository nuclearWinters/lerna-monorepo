import React, { useEffect, useState } from "react";

export const App = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(!show);
  }, []);
  return <h1>Hello world React! Hola</h1>;
};
