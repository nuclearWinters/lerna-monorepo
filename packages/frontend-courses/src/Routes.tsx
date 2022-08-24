import React, { FC, useEffect, useMemo /*useRef*/, useState } from "react";
import {
  BrowserRouter as Router,
  Routes as BrowserRoutes,
  Route,
  Link,
} from "react-router-dom";
import {
  graphql,
  useFragment,
  useSubscription,
  ConnectionHandler,
} from "react-relay";
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
import { GraphQLSubscriptionConfig } from "relay-runtime";
//import { RoutesLoansSubscription } from "__generated__/RoutesLoansSubscription.graphql";
//import {
//  InvestmentStatus,
//  RoutesInvestmentsSubscription,
//} from "__generated__/RoutesInvestmentsSubscription.graphql";
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
import { logOut } from "utils";
import { useTranslation } from "react-i18next";
import { CheckExpiration } from "components/CheckExpiration";
import { Routes_user$key } from "__generated__/Routes_user.graphql";
import { Routes_auth_user$key } from "__generated__/Routes_auth_user.graphql";

const routesFragment = graphql`
  fragment Routes_user on User {
    id
    accountAvailable
    accountTotal
    accountId
    ...Account_user
    ...MyTransactions_user
    ...MyInvestments_user
    ...AddInvestments_user
  }
`;

const routesFragmentAuth = graphql`
  fragment Routes_auth_user on AuthUser {
    id
    name
    apellidoPaterno
    apellidoMaterno
    language
    isBorrower
    isSupport
    ...Settings_auth_user
    ...AddInvestments_auth_user
    ...MyTransactions_auth_user
  }
`;

type Props = {
  user: Routes_user$key;
  authUser: Routes_auth_user$key;
};

/*const subscriptionLoans = graphql`
  subscription RoutesLoansSubscription($status: [LoanStatus!]!) {
    loans_subscribe(status: $status) {
      loan_edge {
        node {
          id
          id_user
          score
          ROI
          goal
          term
          raised
          expiry
          status
          scheduledPayments {
            amortize
            status
            scheduledDate
          }
        }
        cursor
      }
      type
    }
  }
`;*/

const subscriptionTransactions = graphql`
  subscription RoutesTransactionsSubscription($connections: [ID!]!) {
    transactions_subscribe_insert @prependEdge(connections: $connections) {
      node {
        id
        id_user
        id_borrower
        _id_loan
        type
        quantity
        created
      }
      cursor
    }
  }
`;

/*const subscriptionInvestments = graphql`
  subscription RoutesInvestmentsSubscription(
    $user_gid: ID!
    $status: [InvestmentStatus!]!
  ) {
    investments_subscribe(user_gid: $user_gid, status: $status) {
      investment_edge {
        node {
          id
          id_borrower
          id_lender
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
`;*/

const subscriptionUser = graphql`
  subscription RoutesUserSubscription {
    user_subscribe {
      id
      accountAvailable
      accountLent
      accountInterests
      accountTotal
    }
  }
`;

export const Routes: FC<Props> = (props) => {
  const { t, i18n } = useTranslation();
  const user = useFragment<Routes_user$key>(routesFragment, props.user);
  const authUser = useFragment<Routes_auth_user$key>(
    routesFragmentAuth,
    props.authUser
  );
  const { isBorrower, isSupport } = authUser;
  //const userRef = useRef(user_gid);
  const isLogged = !!user.accountId;
  useEffect(() => {
    if (isLogged) {
      i18n.changeLanguage(authUser.language);
    } else {
      i18n.changeLanguage(navigator.language.includes("es") ? "es" : "en");
    }
  }, [i18n, isLogged, user, authUser]);
  /*const configLoans = useMemo<
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
          const record = store.get(
            data.loans_subscribe.loan_edge.node?.id || ""
          );
          if (record) {
            return;
          }
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
            throw new Error("no existe el connectionRecord loans");
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
  );*/
  const [investmentStatus, setInvestmentStatus] = useState<"on_going" | "over">(
    "on_going"
  );
  /*const configInvestments = useMemo<
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
            throw new Error("no existe el connectionRecord investments");
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
  );*/
  const connectionTransactionID = ConnectionHandler.getConnectionID(
    user.id,
    "MyTransactions_user_transactions",
    {}
  );
  const configUser = useMemo<GraphQLSubscriptionConfig<RoutesUserSubscription>>(
    () => ({
      variables: {},
      subscription: subscriptionUser,
    }),
    [user.id]
  );
  const configTransactions = useMemo<
    GraphQLSubscriptionConfig<RoutesTransactionsSubscription>
  >(
    () => ({
      variables: { connections: [connectionTransactionID] },
      subscription: subscriptionTransactions,
    }),
    [connectionTransactionID]
  );
  //useSubscription<RoutesLoansSubscription>(configLoans);
  //useSubscription<RoutesInvestmentsSubscription>(configInvestments);
  useSubscription<RoutesTransactionsSubscription>(configTransactions);
  useSubscription<RoutesUserSubscription>(configUser);
  return (
    <Router>
      <CheckExpiration />
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
                value={user.accountTotal}
                title={t("Valor de la cuenta")}
                colorValue="rgb(1,120,221)"
              />
              <AccountInfo
                value={user.accountAvailable}
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
                value={user.accountTotal}
                title={t("Valor de la cuenta")}
                colorValue="rgb(1,120,221)"
              />
              <AccountInfo
                value={user.accountAvailable}
                title={t("Saldo disponible")}
                colorValue="rgb(58,179,152)"
              />
              <AccountLink
                isLogged={isLogged}
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
                isLogged={isLogged}
                icon={faFunnelDollar}
                title={t("Agregar fondos")}
                path="/addFunds"
              />
              <AccountLink
                isLogged={isLogged}
                icon={faHandHoldingUsd}
                title={t("Retirar fondos")}
                path="/retireFunds"
              />
              <AccountLink
                isLogged={isLogged}
                icon={faFolderOpen}
                title={t("Mis Inversiones")}
                path="/myInvestments"
              />
              <AccountLink
                isLogged={isLogged}
                icon={faExchangeAlt}
                title={t("Mis movimientos")}
                path="/myTransactions"
              />
              <AccountLink
                isLogged={isLogged}
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
                {`${authUser.name || ""} ${authUser.apellidoPaterno || ""} ${
                  authUser.apellidoMaterno || ""
                }`.toUpperCase()}
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
              <BrowserRoutes>
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/account" element={<Account user={user} />} />
                <Route path="/addLoan" element={<AddLoan />} />
                <Route
                  path="/myLoans"
                  element={<AddInvestments user={user} authUser={authUser} />}
                />
                <Route path="/addFunds" element={<AddFunds />} />
                <Route path="/retireFunds" element={<RetireFunds />} />
                <Route
                  path="/settings"
                  element={<Settings user={authUser} />}
                />
              </BrowserRoutes>
            ) : isSupport ? (
              <BrowserRoutes>
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route
                  path="/approveLoan"
                  element={<AddInvestments user={user} authUser={authUser} />}
                />
                <Route
                  path="/settings"
                  element={<Settings user={authUser} />}
                />
              </BrowserRoutes>
            ) : (
              <BrowserRoutes>
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/account" element={<Account user={user} />} />
                <Route
                  path="/addInvestments"
                  element={<AddInvestments user={user} authUser={authUser} />}
                />
                <Route path="/addFunds" element={<AddFunds />} />
                <Route path="/retireFunds" element={<RetireFunds />} />
                <Route
                  path="/myTransactions"
                  element={<MyTransactions user={user} authUser={authUser} />}
                />
                <Route
                  path="/myInvestments"
                  element={
                    <MyInvestments
                      user={user}
                      setInvestmentStatus={setInvestmentStatus}
                      investmentStatus={investmentStatus}
                    />
                  }
                />
                <Route
                  path="/settings"
                  element={<Settings user={authUser} />}
                />
              </BrowserRoutes>
            )}
          </div>
        </Rows>
      </div>
    </Router>
  );
};
