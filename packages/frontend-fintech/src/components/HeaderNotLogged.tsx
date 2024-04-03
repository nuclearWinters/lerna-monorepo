import { useTranslation } from "../utils";
import { FaUserCircle } from "@react-icons/all-files/fa/FaUserCircle";
import { CustomButton } from "../components/CustomButton";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";

export const baseRoutesHeaderNotLogged = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
