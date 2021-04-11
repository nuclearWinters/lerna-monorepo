import React from "react";
import { render } from "@testing-library/react";
import { Options } from "./Options";

test("Options.tsx displays 'Hello world React! Hola Hot Reload Working'", async (done) => {
  const { getByText } = render(<Options />);

  getByText("Hello world React! Hola Hot Reload Working");

  done();
});
