import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const colors = {
  primary: "rgb(0, 100, 180)",
  secondary: "#1bbc9b",
  signUp: "#2c92db",
  warning: "rgb(130, 130, 130)",
  white: "rgb(255,255,255)",
  "rgb(248,248,248)": "rgb(248,248,248)",
  forestgreen: "forestgreen",
  "rgba(221,221,221,0.48)": "rgba(221,221,221,0.48)",
  "rgb(255,90,96)": "rgb(255,90,96)",
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
    boxShadow: [
      "1px 2px 5px #888888",
      "unset",
      "rgba(134,134,134,0.75) 0px 1px 7px 0px inset",
    ],
    letterSpacing: ["1px"],
    width: ["220px", "200px", "600px", "500px", "4px"],
    border: ["none", "1px solid rgb(203,203,203)"],
    fontSize: ["20px", "18px", "14px", "26px", "22px", "16px"],
    color: [
      "rgb(62,62,62)",
      "white",
      "rgb(245, 245, 245)",
      "red",
      "rgb(1,120,221)",
      "rgb(203,203,203)",
      "rgba(62,62,62,0.66)",
      "rgb(58,179,152)",
      "rgb(255,90,96)",
      "black",
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
    paddingBottom: ["6px", "0px"],
    bottom: ["0px", "-10px"],
    marginLeft: ["20px"],
    borderColor: ["rgba(118,118,118,0.3)"],
    borderBottom: ["1px solid rgb(225,225,225)", "1px solid rgb(203,203,203)"],
    borderWidth: ["1px"],
    height: ["70px", "80px"],
    display: ["flex"],
    flexDirection: ["column"],
    flex: ["1"],
    marginTop: ["8px"],
    margin: ["30px 0px", "0px 6px"],
    justifyContent: ["center", "space-between"],
    alignItems: ["flex-start", "center"],
    position: ["relative", "absolute"],
    left: ["50%", "0px"],
    top: ["50%", "0px"],
    transform: ["translateX(-50%) translateY(-50%)"],
    zIndex: ["1"],
    overflowY: ["scroll"],
    marginBottom: ["6px"],
    right: ["10px"],
  },
});

export const sprinkles = createSprinkles(colorProperties);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];
