import { useTranslation } from "../utils";
import { CheckExpiration } from "../authSrc/components/CheckExpiration";
import { FaUserCircle } from "@react-icons/all-files/fa/FaUserCircle";
import { FaSignOutAlt } from "@react-icons/all-files/fa/FaSignOutAlt";
import { FC } from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";
import { CustomButton } from "./CustomButton";
import { authUserQuery, useLogout } from "../authSrc/utilsAuth";
import { utilsAuthQuery } from "../authSrc/__generated__/utilsAuthQuery.graphql";
import { Link } from "../react-router-relay";

const baseRoutesHeaderLogged = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

const baseRoutesLink = stylex.create({
  base: {
    textAlign: "end",
    textDecoration: "none",
    color: "black",
    marginLeft: "10px",
  },
});

const baseRoutesIconUser = stylex.create({
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

const baseHeader = stylex.create({
  base: {
    gridColumnStart: "2",
    gridColumnEnd: "2",
    gridRowStart: "1",
    gridRowEnd: "2",
  },
  notLogged: {
    gridColumnStart: "1",
    gridColumnEnd: "3",
    gridRowStart: "1",
    gridRowEnd: "2",
  },
});

const baseRoutesHeaderNotLogged = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const baseRoutesIconLogout = stylex.create({
  base: {
    margin: "0px 10px",
    cursor: "pointer",
    color: "rgb(62,62,62)",
    fontSize: "28px",
  },
});

export const Header: FC<{ query: PreloadedQuery<utilsAuthQuery, {}> }> = ({
  query,
}) => {
  const { authUser } = usePreloadedQuery(authUserQuery, query);
  const logout = useLogout();
  const navigate = useNavigate();
  const navigateTo = (path: string) => () => {
    navigate(path);
  };
  const { t } = useTranslation();
  return authUser ? (
    <div {...stylex.props(baseHeader.base)}>
      <CheckExpiration />
      <div {...stylex.props(baseRoutesHeaderLogged.base)}>
        <FaUserCircle {...stylex.props(baseRoutesIconUser.base)} />
        <Link to="/settings" {...stylex.props(baseRoutesLink.base)}>
          {`${authUser?.name || ""} ${authUser?.apellidoPaterno || ""} ${
            authUser?.apellidoMaterno || ""
          }`.toUpperCase()}
        </Link>
        <FaSignOutAlt
          onClick={logout}
          {...stylex.props(baseRoutesIconLogout.base)}
        />
      </div>
    </div>
  ) : (
    <div {...stylex.props(baseHeader.notLogged)}>
      <div {...stylex.props(baseRoutesHeaderNotLogged.base)}>
        <FaUserCircle
          {...stylex.props(
            baseRoutesIconUser.base,
            baseRoutesIconUser.notLogged
          )}
        />
        <CustomButton
          text={t("Iniciar sesión")}
          color="logIn"
          onClick={navigateTo("/login")}
        />
        <CustomButton
          text={t("Crear cuenta")}
          color="signUp"
          onClick={navigateTo("/register")}
        />
      </div>
    </div>
  );
};
