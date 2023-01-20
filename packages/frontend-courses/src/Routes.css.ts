import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseRoutes = sprinkles({
  flexDirection: "row",
  height: "100vh",
  width: "100vw",
  display: "grid",
  gridTemplateColumns: "126px 1fr",
  gridAutoRows: "60px 1fr",
});

export const baseRoutesHeaderLogged = sprinkles({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

export const baseRoutesHeaderNotLogged = sprinkles({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const baseRoutesContent = sprinkles({
  flex: "1",
  display: "flex",
  backgroundColor: "rgb(248,248,248)",
  gridRowStart: "2",
  gridRowEnd: "2",
  gridColumnStart: "2",
  gridColumnEnd: "3",
});

export const baseRoutesLink = sprinkles({
  textAlign: "end",
  textDecoration: "none",
  color: "black",
  marginLeft: "10px",
});

export const baseRoutesIconUser = sprinkles({
  fontSize: "28px",
  margin: "12px 0px 12px 0px",
});

export const baseHeader = sprinkles({
  gridColumnStart: "2",
  gridColumnEnd: "2",
  gridRowStart: "1",
  gridRowEnd: "2",
});

export const customHeader = styleVariants({
  fallback: [
    baseHeader,
    sprinkles({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
  ],
});

export const baseSider = sprinkles({
  gridRowStart: "1",
  gridRowEnd: "3",
  gridColumnStart: "1",
  gridColumnEnd: "1",
  display: "flex",
});

export const customRoutesIconUser = styleVariants({
  logged: [
    baseRoutesIconUser,
    sprinkles({
      color: "rgba(255,90,96,0.5)",
    }),
  ],
  notLogged: [
    baseRoutesIconUser,
    sprinkles({
      color: "rgb(140,140,140)",
    }),
  ],
});

export const baseRoutesIconLogout = sprinkles({
  margin: "0px 10px",
  cursor: "pointer",
  color: "rgb(62,62,62)",
  fontSize: "28px",
});

export const baseRoutesIcon = sprinkles({
  fontSize: "28px",
});
