import { authUserQuery, useLogout } from "../utils";
import { CheckExpiration } from "../components/CheckExpiration";
import { FaUserCircle } from "@react-icons/all-files/fa/FaUserCircle";
import { FaSignOutAlt } from "@react-icons/all-files/fa/FaSignOutAlt";
import { FC } from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { AppUserQuery } from "../__generated__/AppUserQuery.graphql";
import { Link } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";

export const baseRoutesHeaderLogged = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export const baseRoutesLink = stylex.create({
  base: {
    textAlign: "end",
    textDecoration: "none",
    color: "black",
    marginLeft: "10px",
  },
});

export const baseRoutesIconUser = stylex.create({
  base: {
    fontSize: "28px",
    margin: "12px 0px 12px 0px",
  },
  logged: {
    color: "rgba(255,90,96,0.5)",
  },
  notLogged: {
    color: "rgb(140,140,140)",
  },
});

export const baseHeader = stylex.create({
  base: {
    gridColumnStart: "2",
    gridColumnEnd: "2",
    gridRowStart: "1",
    gridRowEnd: "2",
  },
  fallback: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const baseRoutesIconLogout = stylex.create({
  base: {
    margin: "0px 10px",
    cursor: "pointer",
    color: "rgb(62,62,62)",
    fontSize: "28px",
  },
});

export const Header: FC<{ query: PreloadedQuery<AppUserQuery, {}> }> = ({
  query,
}) => {
  const { authUser } = usePreloadedQuery(authUserQuery, query);
  const logout = useLogout();
  return (
    <div {...stylex.props(baseHeader.base)}>
      <CheckExpiration />
      <div {...stylex.props(baseRoutesHeaderLogged.base)}>
        <FaUserCircle {...stylex.props(baseRoutesIconUser.base)} />
        <Link to="/settings" {...stylex.props(baseRoutesLink.base)}>
          {`${authUser.name || ""} ${authUser.apellidoPaterno || ""} ${
            authUser.apellidoMaterno || ""
          }`.toUpperCase()}
        </Link>
        <FaSignOutAlt
          onClick={logout}
          {...stylex.props(baseRoutesIconLogout.base)}
        />
      </div>
    </div>
  );
};
