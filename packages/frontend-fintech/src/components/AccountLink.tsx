import React, { FC } from "react";
import { Link, useRouter } from "yarr";
import {
  baseAccountLinkIcon,
  customAccountLinkBox,
  customAccountLinkTitle,
} from "./AccountLink.css";

interface Props {
  title: string;
  icon: JSX.Element;
  path: string;
}

export const AccountLink: FC<Props> = ({ title, icon, path }) => {
  const { isActive } = useRouter();
  const selected = isActive(path);
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
