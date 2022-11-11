import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const colors = {
  primary: "rgb(0, 100, 180)",
  secondary: "#1bbc9b",
  signUp: "#2c92db",
  warning: "rgb(130, 130, 130)",
  white: "rgb(255,255,255)",
  "rgb(248,248,248)": "rgb(248,248,248)",
  forestgreen: "forestgreen",
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
    borderRadius: ["30px", "4px", "8px"],
    boxShadow: ["1px 2px 5px #888888"],
    letterSpacing: ["1px"],
    width: ["220px", "200px", "600px", "500px"],
    border: ["none", "1px solid rgb(203,203,203)"],
    fontSize: ["20px", "18px", "14px", "26px", "22px"],
    color: [
      "rgb(62,62,62)",
      "white",
      "rgb(245, 245, 245)",
      "red",
      "rgb(1,120,221)",
      "rgb(203,203,203)",
    ],
    padding: [
      "10px 10px",
      "6px 6px",
      "20px 0px 6px 0px",
      "14px 0px",
      "4px 0px",
    ],
    textAlign: ["center"],
    fontWeight: ["bold"],
    alignSelf: ["center"],
    paddingTop: ["6px"],
    paddingBottom: ["6px"],
    marginLeft: ["20px"],
    borderColor: ["rgba(118,118,118,0.3)"],
    borderBottom: ["1px solid rgb(225,225,225)", "1px solid rgb(203,203,203)"],
    borderWidth: ["1px"],
    height: ["70px"],
    display: ["flex"],
    flexDirection: ["column"],
    flex: ["1"],
    marginTop: ["8px"],
    margin: ["30px 0px"],
    justifyContent: ["center"],
    alignItems: ["flex-start"],
    position: ["relative", "absolute"],
    left: ["50%"],
    top: ["50%"],
    transform: ["translateX(-50%) translateY(-50%)"],
    zIndex: ["1"],
    overflowY: ["scroll"],
    marginBottom: ["6px"],
  },
});

export const sprinkles = createSprinkles(colorProperties);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];
