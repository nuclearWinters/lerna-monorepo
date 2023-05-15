import React, { FC } from "react";
import { Link } from "yarr";
import {
  baseAccountLinkIcon,
  customAccountLinkBox,
  customAccountLinkTitle,
} from "./AccountLink.css";

interface Props {
  title: string;
  icon: JSX.Element;
  path: string;
  location: string;
}

export const AccountLink: FC<Props> = ({ title, icon, path, location }) => {
  const selected = path === location;
  return (
    <Link
      to={path}
      className={
        selected
          ? customAccountLinkBox["selected"]
          : customAccountLinkBox["notSelected"]
      }
    >
      {selected && <div className={baseAccountLinkIcon} />}
      {icon}
      <div
        className={
          selected
            ? customAccountLinkTitle["selected"]
            : customAccountLinkTitle["notSelected"]
        }
      >
        {title}
      </div>
    </Link>
  );
};
