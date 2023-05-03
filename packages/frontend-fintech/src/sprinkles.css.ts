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
  "#FF9F00": "#FF9F00",
  "#4F7942": "#4F7942",
  "#046307": "#046307",
  "#CA3435": "#CA3435",
  "#44d43b": "#44d43b",
  "rgb(102,141,78)": "rgb(102,141,78)",
  "rgb(245,245,245)": "rgb(245,245,245)",
  "rgba(255,90,96,0.1)": "rgba(255,90,96,0.1)",
  "rgba(90,96,255,0.1)": "rgba(90,96,255,0.1)",
};

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { "@media": "(prefers-color-scheme: dark)" },
  },
  defaultCondition: "lightMode",
  properties: {
    gridRowStart: ["2", "1"],
    gridRowEnd: ["2", "3"],
    gridColumnStart: ["2", "1"],
    gridColumnEnd: ["3", "1", "2"],
    backgroundColor: colors,
    cursor: ["pointer"],
    textDecoration: ["none"],
    borderRadius: ["30px", "4px", "8px", "100%"],
    boxShadow: [
      "1px 2px 5px #888888",
      "unset",
      "rgba(134,134,134,0.75) 0px 1px 7px 0px inset",
    ],
    letterSpacing: ["1px"],
    width: [
      "220px",
      "200px",
      "600px",
      "500px",
      "4px",
      "100%",
      "30px",
      "300px",
      "50px",
      "20px",
      "100vw",
      "70%",
    ],
    border: ["none", "1px solid rgb(203,203,203)", "1px solid #999"],
    fontSize: {
      "20px": "1.4rem",
      "18px": "1.3rem",
      "14px": "1rem",
      "26px": "1.8rem",
      "22px": "1.6rem",
      "16px": "1.1rem",
      "10px": "0.7rem",
      "28px": "2rem",
    },
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
      "#333",
      "rgb(90,96,255)",
      "rgba(255,90,96,0.5)",
      "rgb(140,140,140)",
      "#CD5C5C",
      "#50C878",
      "forestgreen",
    ],
    padding: [
      "10px 10px",
      "6px 6px",
      "20px 0px 6px 0px",
      "14px 0px",
      "4px 0px",
      "10px 0px",
      "3px 0px",
      "4px",
      "30px 0px",
    ],
    textAlign: ["center", "end"],
    fontWeight: ["bold"],
    alignSelf: ["center"],
    paddingTop: ["6px"],
    paddingBottom: ["6px", "0px"],
    bottom: ["0px", "-10px"],
    marginLeft: ["20px", "10px"],
    borderColor: ["rgba(118,118,118,0.3)"],
    borderBottom: ["1px solid rgb(225,225,225)", "1px solid rgb(203,203,203)"],
    borderWidth: ["1px"],
    height: ["70px", "80px", "30px", "20px", "10px", "100vh"],
    display: ["flex", "grid"],
    gridTemplateColumns: ["126px 1fr"],
    gridAutoRows: ["60px 1fr"],
    flexDirection: ["column", "row"],
    flex: ["1"],
    marginTop: ["8px", "14px"],
    margin: [
      "30px 0px",
      "0px 6px",
      "4px",
      "0px 12px",
      "10px 10px",
      "30px 20px",
      "30px 60px",
      "12px 0px 12px 0px",
      "0px 10px",
      "12px 0px",
      "0px 4px",
      "16px",
    ],
    justifyContent: ["center", "space-between", "flex-end"],
    alignItems: ["flex-start", "center"],
    position: ["relative", "absolute"],
    left: ["50%", "0px"],
    top: ["50%", "0px"],
    transform: ["translateX(-50%) translateY(-50%)"],
    zIndex: ["1"],
    overflowY: ["scroll"],
    overflow: ["hidden"],
    marginBottom: ["6px", "8px"],
    right: ["10px"],
    whiteSpace: ["nowrap"],
    textOverflow: ["ellipsis"],
    maxWidth: ["200px"],
  },
});

export const sprinkles = createSprinkles(colorProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];