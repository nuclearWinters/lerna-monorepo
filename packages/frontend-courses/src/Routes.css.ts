import { styleVariants } from "@vanilla-extract/css";
import { sprinkles } from "sprinkles.css";

export const baseRoutes = sprinkles({
  display: "flex",
  flexDirection: "row",
  height: "100vh",
  width: "100vw",
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
