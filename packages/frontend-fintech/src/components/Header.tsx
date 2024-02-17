import { usePreloadedQuery } from "react-relay/hooks";
import { useTranslation, useLogout } from "utils";
import { CheckExpiration } from "components/CheckExpiration";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { CustomButton } from "components/CustomButton";
import AppUserQuery, {
  AppUserQuery as AppUserQueryType,
} from "../__generated__/AppUserQuery.graphql";
import { Link, useNavigation } from "yarr";
import React, { FC } from "react";
import { preloadQuery } from "App";
import {
  baseHeader,
  baseRoutesHeaderLogged,
  baseRoutesHeaderNotLogged,
  baseRoutesIconLogout,
  baseRoutesLink,
  customRoutesIconUser,
} from "Routes.css";

export const Header: FC = () => {
  const logout = useLogout();
  const { t } = useTranslation();
  const { user, authUser } = usePreloadedQuery<AppUserQueryType>(
    AppUserQuery,
    preloadQuery
  );
  const isLogged = user.id !== "VXNlcjo=";
  const navigate = useNavigation();
  const navigateTo = (path: string) => () => {
    navigate.push(path);
  };
  return (
    <div className={baseHeader} style={{}}>
      <CheckExpiration />
      {isLogged ? (
        <div className={baseRoutesHeaderLogged}>
          <FaUserCircle className={customRoutesIconUser["logged"]} />
          <Link to="/settings" className={baseRoutesLink}>
            {`${authUser.name || ""} ${authUser.apellidoPaterno || ""} ${
              authUser.apellidoMaterno || ""
            }`.toUpperCase()}
          </Link>
          <FaSignOutAlt onClick={logout} className={baseRoutesIconLogout} />
        </div>
      ) : (
        <div className={baseRoutesHeaderNotLogged}>
          <FaUserCircle className={customRoutesIconUser["notLogged"]} />
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
      )}
    </div>
  );
};
