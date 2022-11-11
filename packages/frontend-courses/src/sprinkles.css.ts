import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const colors = {
  primary: "rgb(0, 100, 180)",
  secondary: "#1bbc9b",
  signUp: "#2c92db",
  warning: "rgb(130, 130, 130)",
};

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { "@media": "(prefers-color-scheme: dark)" },
  },
  defaultCondition: "lightMode",
  properties: {
    backgroundColor: colors,
    cursor: ["pointer"],
    textDecoration: ["none"],
    borderRadius: ["30px", "4px"],
    boxShadow: ["1px 2px 5px #888888"],
    letterSpacing: ["1px"],
    width: ["220px", "200px"],
    border: ["none"],
    fontSize: ["20px", "18px"],
    color: ["rgb(62,62,62)", "white", "rgb(245, 245, 245)"],
    padding: ["10px 10px"],
    textAlign: ["center"],
    fontWeight: ["bold"],
    alignSelf: ["center"],
    paddingTop: ["6px"],
    paddingBottom: ["6px"],
    marginLeft: ["20px"],
  },
});

export const sprinkles = createSprinkles(colorProperties);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];
