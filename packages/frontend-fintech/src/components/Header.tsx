import { useLogout } from "utils";
import { CheckExpiration } from "components/CheckExpiration";
import { FaUserCircle } from "@react-icons/all-files/fa/FaUserCircle";
import { FaSignOutAlt } from "@react-icons/all-files/fa/FaSignOutAlt";
import React, { FC } from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { AppUserQuery } from "../__generated__/AppUserQuery.graphql";
import {
  authUserQuery,
  baseHeader,
  baseRoutesHeaderLogged,
  baseRoutesIconLogout,
  baseRoutesIconUser,
  baseRoutesLink,
} from "Routes";
import { Link } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";

export const Header: FC<{ query: PreloadedQuery<AppUserQuery, {}> }> = ({
  query,
}) => {
  const { authUser } = usePreloadedQuery<AppUserQuery>(authUserQuery, query);
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
