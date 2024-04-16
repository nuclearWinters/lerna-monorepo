import {
  PreloadedQuery,
  graphql,
  usePreloadedQuery,
  useSubscription,
} from "react-relay/hooks";
import { Icon } from "../components/Icon";
import { AccountInfo } from "../components/AccountInfo";
import { AccountLink } from "../components/AccountLink";
import { Languages, authUserQuery, useTranslation } from "../utils";
import { FaFileAlt } from "@react-icons/all-files/fa/FaFileAlt";
import { FaCartPlus } from "@react-icons/all-files/fa/FaCartPlus";
import { FaFunnelDollar } from "@react-icons/all-files/fa/FaFunnelDollar";
import { FaMoneyCheck } from "@react-icons/all-files/fa/FaMoneyCheck";
import { FaFileContract } from "@react-icons/all-files/fa/FaFileContract";
import { FaUserAlt } from "@react-icons/all-files/fa/FaUserAlt";
import { FaHandHolding } from "@react-icons/all-files/fa/FaHandHolding";
import { FaFolder } from "@react-icons/all-files/fa/FaFolder";
import { FaExchangeAlt } from "@react-icons/all-files/fa/FaExchangeAlt";
import { FC, useEffect, useMemo } from "react";
import { SiderUserSubscription } from "./__generated__/SiderUserSubscription.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";
import { utilsQuery } from "../__generated__/utilsQuery.graphql";

const baseRoutesIcon = stylex.create({
  base: {
    fontSize: "28px",
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
  subscription SiderUserSubscription {
    user_subscribe {
      id
      accountAvailable
      accountToBePaid
      accountTotal
      accountWithheld
    }
  }
`;

export const Sider: FC<{ query: PreloadedQuery<utilsQuery, {}> }> = ({
  query,
}) => {
  const { t, changeLanguage } = useTranslation();
  const { user, authUser } = usePreloadedQuery<utilsQuery>(
    authUserQuery,
    query
  );

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
    if (!authUser) {
      const isLoggedPage = !["/login", "/register", "/"].includes(location);
      if (isLoggedPage) {
        navigate(`/login${isLoggedPage ? `?redirectTo=${location}` : ""}`);
      }
    } else {
      const isNotLoggedPage = ["/login", "/register", "/"].includes(location);
      if (isNotLoggedPage) {
        if (authUser.isBorrower) {
          navigate("/myLoans");
        } else if (authUser.isLender) {
          navigate("/myInvestments");
        } else if (authUser.isSupport) {
          navigate("/approveLoan");
        }
      }
    }
  }, [authUser, navigate, location]);

  useEffect(() => {
    const navigatorLanguage = navigator.language.includes("es") ? "ES" : "EN";
    const language = authUser?.language;
    if (language && language !== navigatorLanguage) {
      changeLanguage(language as Languages);
    }
  }, [authUser, changeLanguage]);

  if (!user || !authUser) {
    return null;
  }

  const { isBorrower, isSupport, isLender } = authUser;

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
