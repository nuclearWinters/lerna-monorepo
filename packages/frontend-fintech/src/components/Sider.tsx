import {
  PreloadedQuery,
  graphql,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { Icon } from "components/Icon";
import { AccountInfo } from "components/AccountInfo";
import { AccountLink } from "components/AccountLink";
import { Rows } from "components/Rows";
import { useTranslation } from "utils";
import { FaFileAlt } from "@react-icons/all-files/fa/FaFileAlt";
import { FaCartPlus } from "@react-icons/all-files/fa/FaCartPlus";
import { FaFunnelDollar } from "@react-icons/all-files/fa/FaFunnelDollar";
import { FaMoneyCheck } from "@react-icons/all-files/fa/FaMoneyCheck";
import { FaFileContract } from "@react-icons/all-files/fa/FaFileContract";
import { FaUserAlt } from "@react-icons/all-files/fa/FaUserAlt";
import { FaHandHolding } from "@react-icons/all-files/fa/FaHandHolding";
import { FaFolder } from "@react-icons/all-files/fa/FaFolder";
import { FaExchangeAlt } from "@react-icons/all-files/fa/FaExchangeAlt";
import React, { FC, useEffect, useMemo } from "react";
import { SiderUserSubscription } from "./__generated__/SiderUserSubscription.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { AppUserQuery } from "../__generated__/AppUserQuery.graphql";
import { authUserQuery, baseRoutesIcon, baseSider } from "Routes";
import { useLocation, useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";

const subscriptionUser = graphql`
  subscription SiderUserSubscription {
    user_subscribe {
      id
      accountAvailable
      accountToBePaid
      accountTotal
    }
  }
`;

export const Sider: FC<{ query: PreloadedQuery<AppUserQuery, {}> }> = ({
  query,
}) => {
  const { t } = useTranslation();
  const {
    user,
    authUser: { isBorrower, isSupport, isLender },
  } = usePreloadedQuery<AppUserQuery>(authUserQuery, query);

  const configUser = useMemo<GraphQLSubscriptionConfig<SiderUserSubscription>>(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    []
  );

  useSubscription<SiderUserSubscription>(configUser);

  const { pathname: location } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isDefaultPath = location === "/";
    if (isDefaultPath) {
      if (isBorrower) {
        navigate("/myLoans");
      } else if (isLender) {
        navigate("/myInvestments");
      } else if (isSupport) {
        navigate("/approveLoan");
      }
    }
  }, [isBorrower, isLender, isSupport, location, navigate]);

  return (
    <div {...stylex.props(baseSider.base)}>
      <Rows>
        {isBorrower ? (
          <>
            <Icon />
            <AccountInfo
              value={user.accountTotal}
              title={t("Valor de la cuenta")}
              type={"total"}
            />
            <AccountInfo
              value={user.accountAvailable}
              title={t("Saldo disponible")}
              type={"available"}
            />
            <AccountLink
              icon={<FaFileAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mi cuenta")}
              path="/account"
              location={location}
            />
            <AccountLink
              icon={<FaMoneyCheck {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Pedir prestamo")}
              path="/addLoan"
              location={location}
            />
            <AccountLink
              icon={<FaFileContract {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis prestamos")}
              path="/myLoans"
              location={location}
            />
            <AccountLink
              icon={<FaFunnelDollar {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Agregar fondos")}
              path="/addFunds"
              location={location}
            />
            <AccountLink
              icon={<FaHandHolding {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt {...stylex.props(baseRoutesIcon.base)} />}
              title="Settings"
              path="/settings"
              location={location}
            />
            <AccountLink
              icon={<FaExchangeAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
              location={location}
            />
          </>
        ) : isSupport ? (
          <>
            <Icon />
            <AccountLink
              icon={<FaFileContract {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Aprobar prestamo")}
              path="/approveLoan"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt {...stylex.props(baseRoutesIcon.base)} />}
              title="Settings"
              path="/settings"
              location={location}
            />
          </>
        ) : (
          <>
            <Icon />
            <AccountInfo
              value={user.accountTotal}
              title={t("Valor de la cuenta")}
              type={"total"}
            />
            <AccountInfo
              value={user.accountAvailable}
              title={t("Saldo disponible")}
              type={"available"}
            />
            <AccountLink
              icon={<FaFileAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mi cuenta")}
              path="/account"
              location={location}
            />
            <AccountLink
              icon={<FaCartPlus {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Comprar")}
              path="/addInvestments"
              location={location}
            />
            <AccountLink
              icon={<FaFunnelDollar {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Agregar fondos")}
              path="/addFunds"
              location={location}
            />
            <AccountLink
              icon={<FaHandHolding {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
              location={location}
            />
            <AccountLink
              icon={<FaFolder {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis inversiones")}
              path="/myInvestments"
              location={location}
            />
            <AccountLink
              icon={<FaExchangeAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt {...stylex.props(baseRoutesIcon.base)} />}
              title={t("Configuración")}
              path="/settings"
              location={location}
            />
          </>
        )}
      </Rows>
    </div>
  );
};
