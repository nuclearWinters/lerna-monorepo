import { useTranslation } from "utils";
import { FaUserCircle } from "@react-icons/all-files/fa/FaUserCircle";
import { CustomButton } from "components/CustomButton";
import React, { FC } from "react";
import {
  baseHeader,
  baseRoutesHeaderNotLogged,
  baseRoutesIconUser,
} from "Routes";
import { useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";

export const HeaderNotLogged: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateTo = (path: string) => () => {
    navigate(path);
  };
  return (
    <div {...stylex.props(baseHeader.base)}>
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
