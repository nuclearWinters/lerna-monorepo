import React, { FC, useMemo } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  graphql,
  useFragment,
  commitLocalUpdate,
  Environment,
  useRelayEnvironment,
  useSubscription,
  ConnectionHandler,
} from "react-relay";
import { Routes_user$key } from "./__generated__/Routes_user.graphql";
import {
  Profile,
  AddInvestments,
  LogIn,
  SignUp,
  AddFunds,
  RetireFunds,
  AddLoan,
  MyTransactions,
  MyInvestments,
} from "./screens";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { tokensAndData } from "App";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { RoutesLoansSubscription } from "__generated__/RoutesLoansSubscription.graphql";
import { RoutesInvestmentsSubscription } from "__generated__/RoutesInvestmentsSubscription.graphql";
import { RoutesTransactionsSubscription } from "__generated__/RoutesTransactionsSubscription.graphql";

const routesFragment = graphql`
  fragment Routes_user on User {
    id
    name
    apellidoPaterno
    apellidoMaterno
    accountTotal
    accountAvailable
    ...Profile_user
    ...AddFunds_user
    ...RetireFunds_user
    ...AddLoan_user
  }
`;

type Props = {
  user: Routes_user$key;
  data: AppQueryResponse;
  refetch: () => void;
};

const subscriptionLoans = graphql`
  subscription RoutesLoansSubscription {
    loans_subscribe {
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
  subscription RoutesInvestmentsSubscription($user_gid: ID!) {
    investments_subscribe(user_gid: $user_gid) {
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

export const Routes: FC<Props> = (props) => {
  const user = useFragment(routesFragment, props.user);
  const user_gid = user.id || "";
  const environment = useRelayEnvironment();
  const configLoans = useMemo<
    GraphQLSubscriptionConfig<RoutesLoansSubscription>
  >(
    () => ({
      variables: {},
      subscription: subscriptionLoans,
      updater: (store, data) => {
        if (data.loans_subscribe.type === "INSERT") {
          const root = store.getRoot();
          const connectionRecord = ConnectionHandler.getConnection(
            root,
            "AddInvestments_query_loans"
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
    []
  );
  const configInvestments = useMemo<
    GraphQLSubscriptionConfig<RoutesInvestmentsSubscription>
  >(
    () => ({
      variables: {
        user_gid,
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
  const { isBorrower, isSupport } = tokensAndData.data;
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
        <div
          style={{
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isBorrower ? (
            <>
              <div>Valor de la cuenta</div>
              <div>${user.accountTotal}</div>
              <div>Saldo disponible</div>
              <div>${user.accountAvailable}</div>
              <Link to="/profile">Mi cuenta</Link>
              <Link to="/addLoan">Pedir prestamo</Link>
              <Link to="/myLoans">Mis prestamos</Link>
              <Link to="/addFunds">Agregar fondos</Link>
              <Link to="/retireFunds">Retirar fondos</Link>
            </>
          ) : isSupport ? (
            <>
              <Link to="/approveLoan">Aprobar prestamo</Link>
            </>
          ) : (
            <>
              <div>Valor de la cuenta</div>
              <div>${user.accountTotal}</div>
              <div>Saldo disponible</div>
              <div>${user.accountAvailable}</div>
              <Link to="/profile">Mi cuenta</Link>
              <Link to="/addInvestments">Comprar</Link>
              <Link to="/addFunds">Agregar fondos</Link>
              <Link to="/retireFunds">Retirar fondos</Link>
              <Link to="/myInvestments">Mis Inversiones</Link>
              <Link to="/myTransactions">Mis movimientos</Link>
            </>
          )}
        </div>
        <div
          style={{
            border: "1px solid black",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {user.id !== "VXNlcjo=" ? (
            <>
              <Link to="/profile" style={{ textAlign: "end" }}>
                ¡Bienvenido!{" "}
                {`${user.name || ""} ${user.apellidoPaterno || ""} ${
                  user.apellidoMaterno || ""
                }`}
              </Link>
              <div
                style={{ textAlign: "end" }}
                onClick={() => {
                  commitDeleteTokensLocally(environment);
                  tokensAndData.tokens = { accessToken: "", refreshToken: "" };
                  tokensAndData.data = {
                    _id: "",
                    email: "",
                    iat: 0,
                    exp: 0,
                    isSupport: false,
                    isLender: true,
                    isBorrower: false,
                  };
                  props.refetch();
                }}
              >
                Log Out
              </div>
            </>
          ) : (
            <div>
              <Link to="/login">Log In</Link>
              <Link to="/register">Register</Link>
              <span>No user</span>
            </div>
          )}
          <div style={{ flex: 1 }}>
            {isBorrower ? (
              <Switch>
                <Route path="/login">
                  <LogIn refetch={props.refetch} />
                </Route>
                <Route path="/register">
                  <SignUp refetch={props.refetch} />
                </Route>
                <Route path="/profile">
                  <Profile user={user} />
                </Route>
                <Route path="/addLoan">
                  <AddLoan user={user} />
                </Route>
                <Route path="/myLoans">
                  <AddInvestments data={props.data} />
                </Route>
                <Route path="/addFunds">
                  <AddFunds user={user} />
                </Route>
                <Route path="/retireFunds">
                  <RetireFunds user={user} />
                </Route>
              </Switch>
            ) : isSupport ? (
              <Switch>
                <Route path="/login">
                  <LogIn refetch={props.refetch} />
                </Route>
                <Route path="/register">
                  <SignUp refetch={props.refetch} />
                </Route>
                <Route path="/approveLoan">
                  <AddInvestments data={props.data} />
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route path="/login">
                  <LogIn refetch={props.refetch} />
                </Route>
                <Route path="/register">
                  <SignUp refetch={props.refetch} />
                </Route>
                <Route path="/profile">
                  <Profile user={user} />
                </Route>
                <Route path="/addInvestments">
                  <AddInvestments
                    user={{
                      id: user.id,
                    }}
                    data={props.data}
                  />
                </Route>
                <Route path="/addFunds">
                  <AddFunds user={user} />
                </Route>
                <Route path="/retireFunds">
                  <RetireFunds user={user} />
                </Route>
                <Route path="/myTransactions">
                  <MyTransactions data={props.data} />
                </Route>
                <Route path="/myInvestments">
                  <MyInvestments data={props.data} />
                </Route>
              </Switch>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
};

function commitDeleteTokensLocally(environment: Environment) {
  return commitLocalUpdate(environment, (store) => {
    const root = store.getRoot();
    const tokens = root.getLinkedRecord("tokens");
    tokens?.setValue("", "accessToken");
    tokens?.setValue("", "refreshToken");
  });
}
