import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  base: {
    fontSize: 16,
    lineHeight: 1.5,
    color: "orange",
    height: "100px",
    width: "100px",
    backgroundColor: "red",
  },
  highlighted: {
    color: "rebeccapurple",
  },
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <div {...stylex.props(styles.base, styles.highlighted)}></div>
      <App />
    </StrictMode>
  );
}
