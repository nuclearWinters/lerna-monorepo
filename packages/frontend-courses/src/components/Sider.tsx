import { usePreloadedQuery, graphql, useSubscription } from "react-relay/hooks";
import { Icon } from "components/Icon";
import { AccountInfo } from "components/AccountInfo";
import { AccountLink } from "components/AccountLink";
import { Rows } from "components/Rows";
import { useTranslation } from "utils";
import {
  FaFileAlt,
  FaCartPlus,
  FaFunnelDollar,
  FaMoneyCheck,
  FaFileContract,
  FaUserAlt,
  FaHandHolding,
  FaFolder,
  FaExchangeAlt,
} from "react-icons/fa";
import AppUserQuery, {
  AppUserQuery as AppUserQueryType,
} from "../__generated__/AppUserQuery.graphql";
import React, { FC, useEffect, useMemo } from "react";
import { preloadQuery } from "App";
import { customAccountInfo } from "components/AccountInfo.css";
import { SiderUserSubscription } from "./__generated__/SiderUserSubscription.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { baseRoutesIcon, baseSider } from "Routes.css";

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

export const Sider: FC = () => {
  const { t, changeLanguage } = useTranslation();
  const { user, authUser } = usePreloadedQuery<AppUserQueryType>(
    AppUserQuery,
    preloadQuery
  );
  const { isBorrower, isSupport } = authUser;
  const isLogged = !!user.accountId;
  useEffect(() => {
    if (isLogged) {
      changeLanguage(authUser.language);
    } else {
      changeLanguage(navigator.language.includes("es") ? "ES" : "EN");
    }
  }, [isLogged, authUser.language, changeLanguage]);

  const configUser = useMemo<GraphQLSubscriptionConfig<SiderUserSubscription>>(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    []
  );

  useSubscription<SiderUserSubscription>(configUser);

  return (
    <div className={baseSider}>
      <Rows>
        {isBorrower ? (
          <>
            <Icon />
            <AccountInfo
              value={user.accountTotal}
              title={t("Valor de la cuenta")}
              className={customAccountInfo["total"]}
            />
            <AccountInfo
              value={user.accountAvailable}
              title={t("Saldo disponible")}
              className={customAccountInfo["available"]}
            />
            <AccountLink
              icon={<FaFileAlt className={baseRoutesIcon} />}
              title={t("Mi cuenta")}
              path="/account"
            />
            <AccountLink
              icon={<FaMoneyCheck className={baseRoutesIcon} />}
              title={t("Pedir prestamo")}
              path="/addLoan"
            />
            <AccountLink
              icon={<FaFileContract className={baseRoutesIcon} />}
              title={t("Mis prestamos")}
              path="/myLoans"
            />
            <AccountLink
              icon={<FaFunnelDollar className={baseRoutesIcon} />}
              title={t("Agregar fondos")}
              path="/addFunds"
            />
            <AccountLink
              icon={<FaHandHolding className={baseRoutesIcon} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
            />
            <AccountLink
              icon={<FaUserAlt className={baseRoutesIcon} />}
              title="Settings"
              path="/settings"
            />
          </>
        ) : isSupport ? (
          <>
            <Icon />
            <AccountLink
              icon={<FaFileContract className={baseRoutesIcon} />}
              title={t("Aprobar prestamo")}
              path="/approveLoan"
            />
            <AccountLink
              icon={<FaUserAlt className={baseRoutesIcon} />}
              title="Settings"
              path="/settings"
            />
          </>
        ) : (
          <>
            <Icon />
            <AccountInfo
              value={user.accountTotal}
              title={t("Valor de la cuenta")}
              className={customAccountInfo["total"]}
            />
            <AccountInfo
              value={user.accountAvailable}
              title={t("Saldo disponible")}
              className={customAccountInfo["available"]}
            />
            <AccountLink
              icon={<FaFileAlt className={baseRoutesIcon} />}
              title={t("Mi cuenta")}
              path="/account"
            />
            <AccountLink
              icon={<FaCartPlus className={baseRoutesIcon} />}
              title={t("Comprar")}
              path="/addInvestments"
            />
            <AccountLink
              icon={<FaFunnelDollar className={baseRoutesIcon} />}
              title={t("Agregar fondos")}
              path="/addFunds"
            />
            <AccountLink
              icon={<FaHandHolding className={baseRoutesIcon} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
            />
            <AccountLink
              icon={<FaFolder className={baseRoutesIcon} />}
              title={t("Mis inversiones")}
              path="/myInvestments"
            />
            <AccountLink
              icon={<FaExchangeAlt className={baseRoutesIcon} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
            />
            <AccountLink
              icon={<FaUserAlt className={baseRoutesIcon} />}
              title={t("Configuración")}
              path="/settings"
            />
          </>
        )}
      </Rows>
    </div>
  );
};
