import {
  PreloadedQuery,
  graphql,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { Icon } from "../../components/Icon";
import { AccountInfo } from "../../components/AccountInfo";
import { AccountLink } from "../../components/AccountLink";
import { useTranslation } from "../../utils";
import FaFileAlt from "../../assets/file-lines-solid.svg?react";
import FaCartPlus from "../../assets/cart-plus-solid.svg?react";
import FaFunnelDollar from "../../assets/filter-circle-dollar-solid.svg?react";
import FaMoneyCheck from "../../assets/money-check-dollar-solid.svg?react";
import FaFileContract from "../../assets/file-contract-solid.svg?react";
import FaUserAlt from "../../assets/user-large-solid.svg?react";
import FaHandHolding from "../../assets/hand-holding-hand-solid.svg?react";
import FaFolder from "../../assets/folder-solid.svg?react";
import FaExchangeAlt from "../../assets/hand-holding-dollar-solid.svg?react";
import { FC, useMemo } from "react";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import * as stylex from "@stylexjs/stylex";
import { fintechUserQuery } from "../utilsFintech";
import { utilsFintechQuery } from "../__generated__/utilsFintechQuery.graphql";
import { SiderFintechUserSubscription } from "./__generated__/SiderFintechUserSubscription.graphql";
import { useLocation } from "../../react-router-elements/utils";

const baseRoutesIcon = stylex.create({
  base: {
    height: "1.8rem",
  },
});

const baseSider = stylex.create({
  base: {
    gridRowStart: "1",
    gridRowEnd: "3",
    gridColumnStart: "1",
    gridColumnEnd: "1",
    display: "flex",
    overflow: "hidden",
    flex: "1",
    position: "relative",
  },
});

const siderMenu = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflow: "scroll",
    width: "100%",
  },
});

const subscriptionUser = graphql`
  subscription SiderFintechUserSubscription {
    user_subscribe {
      id
      accountAvailable
      accountToBePaid
      accountTotal
      accountWithheld
    }
  }
`;

export const SiderFintech: FC<{
  fintechQuery: PreloadedQuery<utilsFintechQuery>;
  isBorrower: boolean;
  isSupport: boolean;
  isLender: boolean;
}> = ({ fintechQuery, isBorrower, isSupport, isLender }) => {
  const { t } = useTranslation();
  const { user } = usePreloadedQuery(fintechUserQuery, fintechQuery);

  const configUser = useMemo<
    GraphQLSubscriptionConfig<SiderFintechUserSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    []
  );

  useSubscription<SiderFintechUserSubscription>(configUser);

  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <div {...stylex.props(baseSider.base)}>
      <div {...stylex.props(siderMenu.base)}>
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
        ) : isLender ? (
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
        ) : null}
      </div>
    </div>
  );
};
