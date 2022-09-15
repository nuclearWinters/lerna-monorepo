import React, { FC, useEffect, useMemo } from "react";
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
import { RoutesLoansSubscription } from "__generated__/RoutesLoansSubscription.graphql";
import { RoutesInvestmentsSubscription } from "__generated__/RoutesInvestmentsSubscription.graphql";
import { RoutesTransactionsSubscription } from "__generated__/RoutesTransactionsSubscription.graphql";
import { RoutesUserSubscription } from "__generated__/RoutesUserSubscription.graphql";
import { Icon } from "components/Icon";
import { AccountInfo } from "components/AccountInfo";
import { AccountLink } from "components/AccountLink";
import { AuthButton } from "components/AuthButton";
import { Rows } from "components/Rows";
import { logOut, useTranslation } from "utils";
import { CheckExpiration } from "components/CheckExpiration";
import { Routes_user$key } from "__generated__/Routes_user.graphql";
import { Routes_auth_user$key } from "__generated__/Routes_auth_user.graphql";
import { RoutesInvestmentsUpdateSubscription } from "__generated__/RoutesInvestmentsUpdateSubscription.graphql";
import { AppLoansQuery$data } from "__generated__/AppLoansQuery.graphql";
import { MyLoans } from "screens/MyLoans";
import { RoutesMyLoansSubscription } from "__generated__/RoutesMyLoansSubscription.graphql";
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
import { css } from "@linaria/atomic";

const routesFragment = graphql`
  fragment Routes_user on User {
    id
    statusLocal
    accountAvailable
    accountTotal
    accountId
    ...Account_user
    ...MyTransactions_user
    ...MyInvestments_user
    ...MyLoans_user
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
    ...MyLoans_auth_user
    ...MyTransactions_auth_user
    ...AddInvestments_auth_query
  }
`;

type Props = {
  user: Routes_user$key;
  authUser: Routes_auth_user$key;
  dataLoans: AppLoansQuery$data;
  connectionID: string;
};

const subscriptionLoans = graphql`
  subscription RoutesLoansSubscription($connections: [ID!]!) {
    loans_subscribe_insert @prependEdge(connections: $connections) {
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
        pending
        pendingCents
      }
      cursor
    }
  }
`;

const subscriptionMyLoans = graphql`
  subscription RoutesMyLoansSubscription($connections: [ID!]!) {
    my_loans_subscribe_insert @prependEdge(connections: $connections) {
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
        pending
        pendingCents
      }
      cursor
    }
  }
`;

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

const subscriptionInvestments = graphql`
  subscription RoutesInvestmentsSubscription(
    $connections: [ID!]!
    $status: [InvestmentStatus!]
  ) {
    investments_subscribe_insert(status: $status)
      @prependEdge(connections: $connections) {
      node {
        id
        id_borrower
        id_lender
        _id_loan
        quantity
        ROI
        payments
        term
        moratory
        created
        updated
        status
        interest_to_earn
        paid_already
        to_be_paid
      }
      cursor
    }
  }
`;

const subscriptionInvestmentsUpdate = graphql`
  subscription RoutesInvestmentsUpdateSubscription {
    investments_subscribe_update {
      id
      id_borrower
      id_lender
      _id_loan
      quantity
      ROI
      payments
      term
      moratory
      created
      updated
      status
      interest_to_earn
      paid_already
      to_be_paid
    }
  }
`;

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

const logInStyle = css`
  background-color: #1bbc9b;
`;

const signUpStyle = css`
  background-color: #2c92db;
`;

export const Routes: FC<Props> = (props) => {
  const { t, changeLanguage } = useTranslation();
  const user = useFragment<Routes_user$key>(routesFragment, props.user);
  const { statusLocal } = user;
  const authUser = useFragment<Routes_auth_user$key>(
    routesFragmentAuth,
    props.authUser
  );
  const { isBorrower, isSupport } = authUser;
  const isLogged = !!user.accountId;
  useEffect(() => {
    if (isLogged) {
      changeLanguage(authUser.language);
    } else {
      changeLanguage(navigator.language.includes("es") ? "ES" : "EN");
    }
  }, [isLogged, user, authUser, changeLanguage]);

  const connectionLoanID = ConnectionHandler.getConnectionID(
    props.connectionID,
    "AddInvestments_query_loansFinancing",
    {}
  );
  const configLoans = useMemo<
    GraphQLSubscriptionConfig<RoutesLoansSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionLoanID],
      },
      subscription: subscriptionLoans,
    }),
    [connectionLoanID]
  );
  const status = useMemo(() => {
    const status = statusLocal ? statusLocal : null;
    return status;
  }, [statusLocal]);
  const connectionMyLoansID = ConnectionHandler.getConnectionID(
    user.id,
    "MyLoans_user_myLoans",
    {
      firstFetch: true,
    }
  );
  const configMyLoans = useMemo<
    GraphQLSubscriptionConfig<RoutesMyLoansSubscription>
  >(
    () => ({
      variables: {
        connections: [connectionMyLoansID],
      },
      subscription: subscriptionMyLoans,
    }),
    [connectionMyLoansID]
  );
  const connectionInvestmentID = ConnectionHandler.getConnectionID(
    user.id,
    "MyInvestments_user_investments",
    {
      status,
      firstFetch: true,
    }
  );
  const configInvestments = useMemo<
    GraphQLSubscriptionConfig<RoutesInvestmentsSubscription>
  >(
    () => ({
      variables: {
        status,
        connections: [connectionInvestmentID],
      },
      subscription: subscriptionInvestments,
    }),
    [status, connectionInvestmentID]
  );
  const configInvestmentsUpdate = useMemo<
    GraphQLSubscriptionConfig<RoutesInvestmentsUpdateSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionInvestmentsUpdate,
    }),
    []
  );
  const connectionTransactionID = ConnectionHandler.getConnectionID(
    user.id,
    "MyTransactions_user_transactions",
    {
      firstFetch: true,
    }
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
  useSubscription<RoutesLoansSubscription>(configLoans);
  useSubscription<RoutesInvestmentsSubscription>(configInvestments);
  useSubscription<RoutesInvestmentsUpdateSubscription>(configInvestmentsUpdate);
  useSubscription<RoutesTransactionsSubscription>(configTransactions);
  useSubscription<RoutesUserSubscription>(configUser);
  useSubscription<RoutesMyLoansSubscription>(configMyLoans);
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
                icon={<FaFileAlt size={28} />}
                title={t("Mi cuenta")}
                path="/account"
              />
              <AccountLink
                icon={<FaMoneyCheck size={28} />}
                title={t("Pedir prestamo")}
                path="/addLoan"
              />
              <AccountLink
                icon={<FaFileContract size={28} />}
                title={t("Mis prestamos")}
                path="/myLoans"
              />
              <AccountLink
                icon={<FaFunnelDollar size={28} />}
                title={t("Agregar fondos")}
                path="/addFunds"
              />
              <AccountLink
                icon={<FaHandHolding size={28} />}
                title={t("Retirar fondos")}
                path="/retireFunds"
              />
              <AccountLink
                icon={<FaUserAlt size={28} />}
                title="Settings"
                path="/settings"
              />
            </>
          ) : isSupport ? (
            <>
              <Icon
                isLogged={isLogged}
                isBorrower={isBorrower}
                isSupport={isSupport}
              />
              <AccountLink
                icon={<FaFileContract size={28} />}
                title={t("Aprobar prestamo")}
                path="/approveLoan"
              />
              <AccountLink
                icon={<FaUserAlt size={28} />}
                title="Settings"
                path="/settings"
              />
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
                icon={<FaFileAlt size={28} />}
                title={t("Mi cuenta")}
                path="/account"
              />
              <AccountLink
                icon={<FaCartPlus size={28} />}
                title={t("Comprar")}
                path="/addInvestments"
              />
              <AccountLink
                isLogged={isLogged}
                icon={<FaFunnelDollar size={28} />}
                title={t("Agregar fondos")}
                path="/addFunds"
              />
              <AccountLink
                isLogged={isLogged}
                icon={<FaHandHolding size={28} />}
                title={t("Retirar fondos")}
                path="/retireFunds"
              />
              <AccountLink
                isLogged={isLogged}
                icon={<FaFolder size={28} />}
                title={t("Mis inversiones")}
                path="/myInvestments"
              />
              <AccountLink
                isLogged={isLogged}
                icon={<FaExchangeAlt size={28} />}
                title={t("Mis movimientos")}
                path="/myTransactions"
              />
              <AccountLink
                isLogged={isLogged}
                icon={<FaUserAlt size={28} />}
                title={t("Configuración")}
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
              <FaUserCircle
                size={28}
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
              <FaSignOutAlt
                onClick={logOut}
                size={28}
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
              <FaUserCircle
                color={"rgb(140,140,140)"}
                size={28}
                style={{ margin: "12px 0px 12px 0px" }}
              />
              <AuthButton
                text={t("Iniciar sesión")}
                className={logInStyle}
                path="/login"
              />
              <AuthButton
                text={t("Crear cuenta")}
                className={signUpStyle}
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
                  element={<MyLoans user={user} authUser={authUser} />}
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
                  element={<MyLoans user={user} authUser={authUser} />}
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
                  element={
                    <AddInvestments
                      authUser={authUser}
                      dataLoans={props.dataLoans}
                    />
                  }
                />
                <Route path="/addFunds" element={<AddFunds />} />
                <Route path="/retireFunds" element={<RetireFunds />} />
                <Route
                  path="/myTransactions"
                  element={<MyTransactions user={user} authUser={authUser} />}
                />
                <Route
                  path="/myInvestments"
                  element={<MyInvestments user={user} />}
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
