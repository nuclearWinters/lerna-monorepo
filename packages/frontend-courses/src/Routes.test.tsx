import React from "react";
import { render } from "@testing-library/react";
import { Routes } from "./Routes";

test("Routes.tsx displays 'Main' and 'Options'", async (done) => {
  const { getByText, getAllByText } = render(<Routes />);

  getByText("Options");
  const listMain = getAllByText("Main");

  expect(listMain.length).toBe(2);

  done();
});
