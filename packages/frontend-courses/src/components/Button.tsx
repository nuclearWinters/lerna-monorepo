import React, { FC, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  style: CSSProperties;
  onClick: () => void;
  text: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
}

export const Button: FC<IProps> = ({
  text,
  style,
  onClick,
  iconLeft,
  iconRight,
}) => {
  return (
    <div style={style} onClick={onClick}>
      {iconLeft && (
        <FontAwesomeIcon
          icon={iconLeft}
          size="sm"
          color={"rgba(0,0,0,0.4)"}
          style={{
            fontSize: 16,
            cursor: "pointer",
            paddingRight: 8,
          }}
        />
      )}
      {!!text && text}
      {iconRight && (
        <FontAwesomeIcon
          icon={iconRight}
          size="sm"
          color={"rgba(0,0,0,0.4)"}
          style={{
            fontSize: 16,
            cursor: "pointer",
            paddingRight: 8,
          }}
        />
      )}
    </div>
  );
};
