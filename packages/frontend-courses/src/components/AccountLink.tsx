import React, { FC, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Props {
  title: string;
  icon: IconDefinition;
  path: string;
  isLogged?: boolean;
}

export const AccountLink: FC<Props> = ({ title, icon, path, isLogged }) => {
  const location = useLocation();
  const history = useHistory();

  const navigate = useCallback(() => {
    history.push(isLogged === undefined || isLogged ? path : "/login");
  }, [history, path, isLogged]);

  const selected = location.pathname === path;

  return (
    <div
      onClick={navigate}
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
      <FontAwesomeIcon icon={icon} size={"2x"} />
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
