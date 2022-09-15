import React, { FC, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  title: string;
  icon: JSX.Element;
  path: string;
  isLogged?: boolean;
}

export const AccountLink: FC<Props> = ({ title, icon, path, isLogged }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const navigateTo = useCallback(() => {
    navigateRef.current(isLogged === undefined || isLogged ? path : "/login");
  }, [navigateRef, path, isLogged]);

  const selected = location.pathname === path;

  return (
    <div
      onClick={navigateTo}
      style={{
        height: 80,
        display: "flex",
        borderBottom: "1px solid rgb(225,225,225)",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: selected ? "rgba(221,221,221,0.48)" : "white",
        boxShadow: selected
          ? "rgba(134,134,134,0.75) 0px 1px 7px 0px inset"
          : undefined,
        cursor: "pointer",
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: "rgb(255,90,96)",
          }}
        />
      )}
      {icon}
      <div
        style={{
          fontSize: 16,
          color: selected ? "rgb(255,90,96)" : "rgb(62,62,62)",
        }}
      >
        {title}
      </div>
    </div>
  );
};
