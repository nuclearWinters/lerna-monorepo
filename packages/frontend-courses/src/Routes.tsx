import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  graphql,
  useFragment,
  useSubscription,
  ConnectionHandler,
} from "react-relay";
import { Routes_query$key } from "./__generated__/Routes_query.graphql";
import {
  Account,
  AddInvestments,
  LogIn,
  SignUp,
  AddFunds,
  RetireFunds,
  AddLoan,
  MyTransactions,
  MyInvestments,
  Settings,
} from "./screens";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { tokensAndData } from "App";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { RoutesLoansSubscription } from "__generated__/RoutesLoansSubscription.graphql";
import {
  InvestmentStatus,
  RoutesInvestmentsSubscription,
} from "__generated__/RoutesInvestmentsSubscription.graphql";
import { RoutesTransactionsSubscription } from "__generated__/RoutesTransactionsSubscription.graphql";
import { RoutesUserSubscription } from "__generated__/RoutesUserSubscription.graphql";
import { Icon } from "components/Icon";
import { AccountInfo } from "components/AccountInfo";
import { AccountLink } from "components/AccountLink";
import {
  faCartPlus,
  faFileAlt,
  faFunnelDollar,
  faHandHoldingUsd,
  faExchangeAlt,
  faFolderOpen,
  faUserAlt,
  faUserCircle,
  faSignOutAlt,
  faFileContract,
  faMoneyCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthButton } from "components/AuthButton";
import { Rows } from "components/Rows";
import { generateCents, generateCurrency, logOut } from "utils";
import { useTranslation } from "react-i18next";

const routesFragment = graphql`
  fragment Routes_query on Query {
    user(id: $id) {
      id
      investments {
        _id_loan
        quantity
        term
        ROI
        payments
      }
      accountAvailable
      ...AddFunds_user
      ...RetireFunds_user
      ...AddLoan_user
      ...Account_user
    }
    authUser(id: $id) {
      id
      name
      apellidoPaterno
      apellidoMaterno
      language
      isBorrower
      isSupport
      ...Settings_auth_user
      ...SignUp_auth_user
      ...LogIn_auth_user
    }
  }
`;

type Props = {
  user: Routes_query$key;
  data: AppQueryResponse;
};

export interface IUserInvestments {
  _id_loan: string;
  quantity: number;
  term: number;
  ROI: number;
  payments: number;
}

const subscriptionLoans = graphql`
  subscription RoutesLoansSubscription($status: [LoanStatus!]!) {
    loans_subscribe(status: $status) {
      loan_edge {
        node {
          id
          _id_user
          score
          ROI
          goal
          term
          raised
          expiry
          status
        }
        cursor
      }
      type
    }
  }
`;

const subscriptionTransactions = graphql`
  subscription RoutesTransactionsSubscription($user_gid: ID!) {
    transactions_subscribe(user_gid: $user_gid) {
      transaction_edge {
        node {
          id
          _id_user
          count
          history {
            id
            _id_borrower
            _id_loan
            type
            quantity
            created
          }
        }
        cursor
      }
      type
    }
  }
`;

const subscriptionInvestments = graphql`
  subscription RoutesInvestmentsSubscription(
    $user_gid: ID!
    $status: [InvestmentStatus!]!
  ) {
    investments_subscribe(user_gid: $user_gid, status: $status) {
      investment_edge {
        node {
          id
          _id_borrower
          _id_lender
          _id_loan
          quantity
          created
          updated
          status
        }
        cursor
      }
      type
    }
  }
`;

const subscriptionUser = graphql`
  subscription RoutesUserSubscription($user_gid: ID!) {
    user_subscribe(user_gid: $user_gid) {
      user {
        id
        accountAvailable
        investments {
          _id_loan
          quantity
          term
          ROI
          payments
        }
      }
    }
  }
`;

export const Routes: FC<Props> = (props) => {
  const { t, i18n } = useTranslation();
  const user = useFragment(routesFragment, props.user);
  const { isBorrower, isSupport } = user.authUser;
  const user_gid = user.user.id;
  const userRef = useRef(user_gid);
  const isLogged = user.user.id !== "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=";
  useEffect(() => {
    if (isLogged) {
      i18n.changeLanguage(user.authUser.language);
    } else {
      i18n.changeLanguage(navigator.language.includes("es") ? "es" : "en");
    }
  }, [i18n, isLogged, user]);
  const configLoans = useMemo<
    GraphQLSubscriptionConfig<RoutesLoansSubscription>
  >(
    () => ({
      variables: {
        status: isBorrower
          ? ["FINANCING", "TO_BE_PAID", "WAITING_FOR_APPROVAL"]
          : isSupport
          ? ["WAITING_FOR_APPROVAL"]
          : ["FINANCING"],
      },
      subscription: subscriptionLoans,
      updater: (store, data) => {
        if (data.loans_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "AddInvestments_query_loans",
            {
              status: isBorrower
                ? ["FINANCING", "TO_BE_PAID", "WAITING_FOR_APPROVAL"]
                : isSupport
                ? ["WAITING_FOR_APPROVAL"]
                : ["FINANCING"],
            }
          );
          if (!connectionRecord) {
            throw new Error("no existe el connectionRecord");
          }
          const payload = store.getRootField("loans_subscribe");
          const serverEdge = payload?.getLinkedRecord("loan_edge");
          const newEdge = ConnectionHandler.buildConnectionEdge(
            store,
            connectionRecord,
            serverEdge
          );
          if (!newEdge) {
            throw new Error("no existe el newEdge");
          }
          ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
        }
      },
    }),
    [isBorrower, isSupport]
  );
  const [investmentStatus, setInvestmentStatus] = useState<"on_going" | "over">(
    "on_going"
  );
  const configInvestments = useMemo<
    GraphQLSubscriptionConfig<RoutesInvestmentsSubscription>
  >(
    () => ({
      variables: {
        user_gid,
        status:
          userRef.current !== user_gid
            ? ([
                "UP_TO_DATE",
                "DELAY_PAYMENT",
                "FINANCING",
              ] as InvestmentStatus[])
            : investmentStatus === "on_going"
            ? ([
                "UP_TO_DATE",
                "DELAY_PAYMENT",
                "FINANCING",
              ] as InvestmentStatus[])
            : (["PAID", "PAST_DUE"] as InvestmentStatus[]),
      },
      subscription: subscriptionInvestments,
      updater: (store, data) => {
        if (data.investments_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "MyInvestments_query_investments",
            {
              user_id: tokensAndData.data._id,
              status:
                userRef.current !== user_gid
                  ? ([
                      "UP_TO_DATE",
                      "DELAY_PAYMENT",
                      "FINANCING",
                    ] as InvestmentStatus[])
                  : investmentStatus === "on_going"
                  ? ([
                      "UP_TO_DATE",
                      "DELAY_PAYMENT",
                      "FINANCING",
                    ] as InvestmentStatus[])
                  : (["PAID", "PAST_DUE"] as InvestmentStatus[]),
            }
          );
          if (!connectionRecord) {
            throw new Error("no existe el connectionRecord");
          }
          const payload = store.getRootField("investments_subscribe");
          const serverEdge = payload?.getLinkedRecord("investment_edge");
          const newEdge = ConnectionHandler.buildConnectionEdge(
            store,
            connectionRecord,
            serverEdge
          );
          if (!newEdge) {
            throw new Error("no existe el newEdge");
          }
          ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
        }
      },
    }),
    [user_gid, investmentStatus]
  );
  const configUser = useMemo<GraphQLSubscriptionConfig<RoutesUserSubscription>>(
    () => ({
      variables: {
        user_gid,
      },
      subscription: subscriptionUser,
    }),
    [user_gid]
  );
  const configTransactions = useMemo<
    GraphQLSubscriptionConfig<RoutesTransactionsSubscription>
  >(
    () => ({
      variables: {
        user_gid,
      },
      subscription: subscriptionTransactions,
      updater: (store, data) => {
        if (data.transactions_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "MyTransactions_query_transactions",
            {
              user_id: tokensAndData.data._id,
            }
          );
          if (!connectionRecord) {
            throw new Error("no existe el connectionRecord");
          }
          const payload = store.getRootField("transactions_subscribe");
          const serverEdge = payload?.getLinkedRecord("transaction_edge");
          const newEdge = ConnectionHandler.buildConnectionEdge(
            store,
            connectionRecord,
            serverEdge
          );
          if (!newEdge) {
            throw new Error("no existe el newEdge");
          }
          ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
        }
      },
    }),
    [user_gid]
  );
  useSubscription<RoutesLoansSubscription>(configLoans);
  useSubscription<RoutesInvestmentsSubscription>(configInvestments);
  useSubscription<RoutesTransactionsSubscription>(configTransactions);
  useSubscription<RoutesUserSubscription>(configUser);
  const reducedInvestments = user.user.investments.reduce<IUserInvestments[]>(
    (acc, item) => {
      const index = acc.findIndex((acc) => acc._id_loan === item._id_loan);
      if (index === -1) {
        acc.push({ ...item, quantity: item.quantity });
      } else {
        acc[index].quantity += item.quantity;
      }
      return acc;
    },
    []
  );
  const accountTotal =
    reducedInvestments.reduce((acc, { term, ROI, quantity, payments }) => {
      const TEM = Math.pow(1 + ROI / 100, 1 / 12) - 1;
      const owes =
        Math.floor(quantity / ((1 - Math.pow(1 / (1 + TEM), term)) / TEM)) *
        (term - payments);
      return acc + owes;
    }, 0) + generateCents(user.user.accountAvailable);
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Rows>
          {isBorrower ? (
            <>
              <Icon
                isLogged={isLogged}
                isBorrower={isBorrower}
                isSupport={isSupport}
              />
              <AccountInfo
                value={generateCurrency(accountTotal)}
                title={t("Valor de la cuenta")}
                colorValue="rgb(1,120,221)"
              />
              <AccountInfo
                value={user.user.accountAvailable}
                title={t("Saldo disponible")}
                colorValue="rgb(58,179,152)"
              />
              <AccountLink
                icon={faFileAlt}
                title={t("Mi cuenta")}
                path="/account"
              />
              <AccountLink
                icon={faMoneyCheck}
                title={t("Pedir prestamo")}
                path="/addLoan"
              />
              <AccountLink
                icon={faFileContract}
                title={t("Mis prestamos")}
                path="/myLoans"
              />
              <AccountLink
                icon={faFunnelDollar}
                title={t("Agregar fondos")}
                path="/addFunds"
              />
              <AccountLink
                icon={faHandHoldingUsd}
                title={t("Retirar fondos")}
                path="/retireFunds"
              />
              <AccountLink icon={faUserAlt} title="Settings" path="/settings" />
            </>
          ) : isSupport ? (
            <>
              <Icon
                isLogged={isLogged}
                isBorrower={isBorrower}
                isSupport={isSupport}
              />
              <AccountLink
                icon={faFileContract}
                title={t("Aprobar prestamo")}
                path="/approveLoan"
              />
              <AccountLink icon={faUserAlt} title="Settings" path="/settings" />
            </>
          ) : (
            <>
              <Icon
                isLogged={isLogged}
                isBorrower={isBorrower}
                isSupport={isSupport}
              />
              <AccountInfo
                value={generateCurrency(accountTotal)}
                title={t("Valor de la cuenta")}
                colorValue="rgb(1,120,221)"
              />
              <AccountInfo
                value={user.user.accountAvailable}
                title={t("Saldo disponible")}
                colorValue="rgb(58,179,152)"
              />
              <AccountLink
                icon={faFileAlt}
                title={t("Mi cuenta")}
                path="/account"
              />
              <AccountLink
                icon={faCartPlus}
                title={t("Comprar")}
                path="/addInvestments"
              />
              <AccountLink
                icon={faFunnelDollar}
                title={t("Agregar fondos")}
                path="/addFunds"
              />
              <AccountLink
                icon={faHandHoldingUsd}
                title={t("Retirar fondos")}
                path="/retireFunds"
              />
              <AccountLink
                icon={faFolderOpen}
                title={t("Mis Inversiones")}
                path="/myInvestments"
              />
              <AccountLink
                icon={faExchangeAlt}
                title={t("Mis movimientos")}
                path="/myTransactions"
              />
              <AccountLink
                icon={faUserAlt}
                title={t("Settings")}
                path="/settings"
              />
            </>
          )}
        </Rows>
        <Rows
          style={{
            flex: 1,
          }}
        >
          {isLogged ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                size={"2x"}
                color={"rgba(255,90,96,0.5)"}
                style={{ margin: "12px 0px 12px 0px" }}
              />
              <Link
                to="/settings"
                style={{
                  textAlign: "end",
                  textDecoration: "none",
                  color: "black",
                  marginLeft: 10,
                }}
              >
                {`${user.authUser.name || ""} ${
                  user.authUser.apellidoPaterno || ""
                } ${user.authUser.apellidoMaterno || ""}`.toUpperCase()}
              </Link>
              <FontAwesomeIcon
                onClick={logOut}
                icon={faSignOutAlt}
                size={"2x"}
                color={"rgba(62,62,62)"}
                style={{ margin: "0px 10px", cursor: "pointer" }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                color={"rgb(140,140,140)"}
                size={"2x"}
                style={{ margin: "12px 0px 12px 0px" }}
              />
              <AuthButton
                text={t("Iniciar sesión")}
                style={{ backgroundColor: "#1bbc9b" }}
                path="/login"
              />
              <AuthButton
                text={t("Crear cuenta")}
                style={{ backgroundColor: "#2c92db" }}
                path="/register"
              />
            </div>
          )}
          <div style={{ flex: 1, display: "flex" }}>
            {isBorrower ? (
              <Switch>
                <Route path="/login">
                  <LogIn user={user.authUser} />
                </Route>
                <Route path="/register">
                  <SignUp user={user.authUser} />
                </Route>
                <Route path="/account">
                  <Account user={user.user} />
                </Route>
                <Route path="/addLoan">
                  <AddLoan user={user.user} />
                </Route>
                <Route path="/myLoans">
                  <AddInvestments data={props.data} />
                </Route>
                <Route path="/addFunds">
                  <AddFunds user={user.user} />
                </Route>
                <Route path="/retireFunds">
                  <RetireFunds user={user.user} />
                </Route>
                <Route path="/settings">
                  <Settings user={user.authUser} />
                </Route>
              </Switch>
            ) : isSupport ? (
              <Switch>
                <Route path="/login">
                  <LogIn user={user.authUser} />
                </Route>
                <Route path="/register">
                  <SignUp user={user.authUser} />
                </Route>
                <Route path="/approveLoan">
                  <AddInvestments data={props.data} />
                </Route>
                <Route path="/settings">
                  <Settings user={user.authUser} />
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route path="/login">
                  <LogIn user={user.authUser} />
                </Route>
                <Route path="/register">
                  <SignUp user={user.authUser} />
                </Route>
                <Route path="/account">
                  <Account user={user.user} />
                </Route>
                <Route path="/addInvestments">
                  <AddInvestments data={props.data} />
                </Route>
                <Route path="/addFunds">
                  <AddFunds user={user.user} />
                </Route>
                <Route path="/retireFunds">
                  <RetireFunds user={user.user} />
                </Route>
                <Route path="/myTransactions">
                  <MyTransactions data={props.data} />
                </Route>
                <Route path="/myInvestments">
                  <MyInvestments
                    data={props.data}
                    setInvestmentStatus={setInvestmentStatus}
                    investmentStatus={investmentStatus}
                  />
                </Route>
                <Route path="/settings">
                  <Settings user={user.authUser} />
                </Route>
              </Switch>
            )}
          </div>
        </Rows>
      </div>
    </Router>
  );
};
