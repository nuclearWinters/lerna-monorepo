import React from "react";
import { render } from "@testing-library/react";
import { Main } from "./Main";

test("Main.tsx displays 'Main'", async (done) => {
  const { getByText } = render(<Main />);

  getByText("Main");

  done();
});
