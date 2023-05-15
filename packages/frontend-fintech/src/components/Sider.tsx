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
import React, { FC, useEffect, useMemo, useState } from "react";
import { preloadQuery } from "App";
import { customAccountInfo } from "components/AccountInfo.css";
import { SiderUserSubscription } from "./__generated__/SiderUserSubscription.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { baseRoutesIcon, baseSider } from "Routes.css";
import { useHistory } from "yarr";

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
  const { t } = useTranslation();
  const { user, authUser } = usePreloadedQuery<AppUserQueryType>(
    AppUserQuery,
    preloadQuery
  );
  const { isBorrower, isSupport } = authUser;

  const configUser = useMemo<GraphQLSubscriptionConfig<SiderUserSubscription>>(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    []
  );

  useSubscription<SiderUserSubscription>(configUser);

  const history = useHistory();
  const [location, setLocation] = useState(window.location.pathname);

  useEffect(() => {
    history.listen((state) => {
      setLocation(state.pathname);
    });
  }, [history]);

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
              location={location}
            />
            <AccountLink
              icon={<FaMoneyCheck className={baseRoutesIcon} />}
              title={t("Pedir prestamo")}
              path="/addLoan"
              location={location}
            />
            <AccountLink
              icon={<FaFileContract className={baseRoutesIcon} />}
              title={t("Mis prestamos")}
              path="/myLoans"
              location={location}
            />
            <AccountLink
              icon={<FaFunnelDollar className={baseRoutesIcon} />}
              title={t("Agregar fondos")}
              path="/addFunds"
              location={location}
            />
            <AccountLink
              icon={<FaHandHolding className={baseRoutesIcon} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt className={baseRoutesIcon} />}
              title="Settings"
              path="/settings"
              location={location}
            />
            <AccountLink
              icon={<FaExchangeAlt className={baseRoutesIcon} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
              location={location}
            />
          </>
        ) : isSupport ? (
          <>
            <Icon />
            <AccountLink
              icon={<FaFileContract className={baseRoutesIcon} />}
              title={t("Aprobar prestamo")}
              path="/approveLoan"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt className={baseRoutesIcon} />}
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
              location={location}
            />
            <AccountLink
              icon={<FaCartPlus className={baseRoutesIcon} />}
              title={t("Comprar")}
              path="/addInvestments"
              location={location}
            />
            <AccountLink
              icon={<FaFunnelDollar className={baseRoutesIcon} />}
              title={t("Agregar fondos")}
              path="/addFunds"
              location={location}
            />
            <AccountLink
              icon={<FaHandHolding className={baseRoutesIcon} />}
              title={t("Retirar fondos")}
              path="/retireFunds"
              location={location}
            />
            <AccountLink
              icon={<FaFolder className={baseRoutesIcon} />}
              title={t("Mis inversiones")}
              path="/myInvestments"
              location={location}
            />
            <AccountLink
              icon={<FaExchangeAlt className={baseRoutesIcon} />}
              title={t("Mis movimientos")}
              path="/myTransactions"
              location={location}
            />
            <AccountLink
              icon={<FaUserAlt className={baseRoutesIcon} />}
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
