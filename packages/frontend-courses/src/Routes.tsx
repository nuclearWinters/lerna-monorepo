import {
  loadQuery,
  PreloadedQuery,
  useQueryLoader,
  usePreloadedQuery,
  graphql,
  useSubscription,
  useMutation,
} from "react-relay/hooks";
import { Icon } from "components/Icon";
import { AccountInfo } from "components/AccountInfo";
import { AccountLink } from "components/AccountLink";
import { Rows } from "components/Rows";
import { logOut, useTranslation } from "utils";
import { CheckExpiration } from "components/CheckExpiration";
import {
  FaUserCircle,
  FaSignOutAlt,
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
import { CustomButton } from "components/CustomButton";
import { RelayEnvironment, subscriptionsClient } from "RelayEnvironment";
import SettingsAuthUserQuery from "./screens/__generated__/SettingsAuthUserQuery.graphql";
import AccountUserQuery from "./screens/__generated__/AccountUserQuery.graphql";
import MyInvestmentsUserQuery from "./screens/__generated__/MyInvestmentsUserQuery.graphql";
import MyTransactionsQuery from "./screens/__generated__/MyTransactionsQuery.graphql";
import AddInvestmentsQuery from "./screens/__generated__/AddInvestmentsQuery.graphql";
import MyLoansQuery from "./screens/__generated__/MyLoansQuery.graphql";
import AppUserQuery, {
  AppUserQuery as AppUserQueryType,
} from "./__generated__/AppUserQuery.graphql";
import { Link, RouteConfig, useNavigation } from "yarr";
import React, { FC, useEffect, ReactNode, useCallback, useMemo } from "react";
import { preloadQuery, tokensAndData } from "App";
import { Decode } from "./screens/LogIn";
import decode from "jwt-decode";
import { customAccountInfo } from "components/AccountInfo.css";
import { customRows } from "components/Rows.css";
import { RoutesUserSubscription } from "__generated__/RoutesUserSubscription.graphql";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import {
  baseRoutes,
  baseRoutesContent,
  baseRoutesHeaderLogged,
  baseRoutesHeaderNotLogged,
  baseRoutesIcon,
  baseRoutesIconLogout,
  baseRoutesLink,
  customRoutesIconUser,
} from "Routes.css";
import { RoutesLogOutMutation } from "__generated__/RoutesLogOutMutation.graphql";
import { nanoid } from "nanoid";

const subscriptionUser = graphql`
  subscription RoutesUserSubscription {
    user_subscribe {
      id
      accountAvailable
      accountToBePaid
      accountTotal
    }
  }
`;

type Props = {
  children: ReactNode;
};

export const Header: FC<Props> = (props) => {
  const { t, changeLanguage } = useTranslation();
  const [queryRef, loadQuery] = useQueryLoader<AppUserQueryType>(
    AppUserQuery,
    preloadQuery
  );
  const { user, authUser } = usePreloadedQuery<AppUserQueryType>(
    AppUserQuery,
    queryRef || preloadQuery
  );
  const [commit] = useMutation<RoutesLogOutMutation>(graphql`
    mutation RoutesLogOutMutation($input: LogOutInput!) {
      logOut(input: $input) {
        error
      }
    }
  `);
  const logOutCallback = useCallback(
    (callback?: () => void) => {
      commit({
        variables: {
          input: {},
        },
        onCompleted: () => {
          callback && callback();
        },
      });
    },
    [commit]
  );
  tokensAndData.logOut = logOutCallback;
  const refetchUser = useCallback(() => {
    loadQuery({}, { fetchPolicy: "network-only" });
    subscriptionsClient.restart();
  }, [loadQuery]);
  tokensAndData.refetchUser = refetchUser;
  const { isBorrower, isSupport } = authUser;
  const isLogged = !!user.accountId;
  useEffect(() => {
    if (isLogged) {
      changeLanguage(authUser.language);
    } else {
      changeLanguage(navigator.language.includes("es") ? "ES" : "EN");
    }
  }, [isLogged, authUser.language, changeLanguage]);

  const configUser = useMemo<GraphQLSubscriptionConfig<RoutesUserSubscription>>(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    [user.id]
  );

  useSubscription<RoutesUserSubscription>(configUser);
  const navigate = useNavigation();
  const navigateTo = (path: string) => () => {
    navigate.push(path);
  };
  return (
    <>
      <CheckExpiration />
      <div className={baseRoutes}>
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
        <Rows className={customRows["flex1"]}>
          {isLogged ? (
            <div className={baseRoutesHeaderLogged}>
              <FaUserCircle className={customRoutesIconUser["logged"]} />
              <Link to="/settings" className={baseRoutesLink}>
                {`${authUser.name || ""} ${authUser.apellidoPaterno || ""} ${
                  authUser.apellidoMaterno || ""
                }`.toUpperCase()}
              </Link>
              <FaSignOutAlt onClick={logOut} className={baseRoutesIconLogout} />
            </div>
          ) : (
            <div className={baseRoutesHeaderNotLogged}>
              <FaUserCircle className={customRoutesIconUser["notLogged"]} />
              <CustomButton
                text={t("Iniciar sesión")}
                color="logIn"
                onClick={navigateTo("/login")}
              />
              <CustomButton
                text={t("Crear cuenta")}
                color="signUp"
                onClick={navigateTo("/register")}
              />
            </div>
          )}
          <div className={baseRoutesContent}>{props.children}</div>
        </Rows>
      </div>
    </>
  );
};

export type IRouteConfig = RouteConfig<
  string,
  string,
  {
    params: {};
    search: {};
    preloaded: { query: PreloadedQuery<any>; id?: string };
  }
>[];

export const routes: IRouteConfig = [
  {
    component: async () => {
      const module = await import("./screens/LogIn");
      return module.LogIn;
    },
    path: "/login",
  },
  {
    component: async () => {
      const module = await import("./screens/SignUp");
      return module.SignUp;
    },
    path: "/register",
  },
  {
    component: async () => {
      const module = await import("./screens/Account");
      return module.Account;
    },
    path: "/account",
    preload: () => ({
      query: loadQuery(RelayEnvironment, AccountUserQuery, {}),
    }),
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/Settings");
      return module.Settings;
    },
    path: "/settings",
    preload: () => ({
      query: loadQuery(RelayEnvironment, SettingsAuthUserQuery, {}),
    }),
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyInvestments");
      return module.MyInvestments;
    },
    path: "/myInvestments",
    preload: () => {
      const id = nanoid();
      return {
        id,
        query: loadQuery(
          RelayEnvironment,
          MyInvestmentsUserQuery,
          {
            identifier: id,
          },
          { fetchPolicy: "network-only" }
        ),
      };
    },
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isLender) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyTransactions");
      return module.MyTransactions;
    },
    path: "/myTransactions",
    preload: () => {
      const id = nanoid();
      return {
        id,
        query: loadQuery(
          RelayEnvironment,
          MyTransactionsQuery,
          { identifier: id },
          { fetchPolicy: "network-only" }
        ),
      };
    },
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!(data?.isLender || data.isBorrower)) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddFunds");
      return module.AddFunds;
    },
    path: "/addFunds",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/RetireFunds");
      return module.RetireFunds;
    },
    path: "/retireFunds",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddInvestments");
      return module.AddInvestments;
    },
    path: "/addInvestments",
    preload: () => ({
      query: loadQuery(RelayEnvironment, AddInvestmentsQuery, {}),
    }),
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport || data?.isBorrower) {
          return "/login";
        }
        return null;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyLoans");
      return module.MyLoans;
    },
    path: "/approveLoan",
    preload: () => ({
      query: loadQuery(RelayEnvironment, MyLoansQuery, {}),
    }),
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyLoans");
      return module.MyLoans;
    },
    path: "/myLoans",
    preload: () => ({
      query: loadQuery(RelayEnvironment, MyLoansQuery, {}),
    }),
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isBorrower) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddLoan");
      return module.AddLoan;
    },
    path: "/addLoan",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isBorrower) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/LogIn");
      return module.LogIn;
    },
    path: "/",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isBorrower) {
          return "/myLoans";
        } else if (data?.isLender) {
          return "/addInvestments";
        } else {
          return "/myLoans";
        }
      }
      return "/login";
    },
  },
];
