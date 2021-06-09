import React, { FC, useMemo, useState } from "react";
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
  Settings,
} from "./screens";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { getStatus, tokensAndData } from "App";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { RoutesLoansSubscription } from "__generated__/RoutesLoansSubscription.graphql";
import {
  InvestmentStatus,
  RoutesInvestmentsSubscription,
} from "__generated__/RoutesInvestmentsSubscription.graphql";
import { RoutesTransactionsSubscription } from "__generated__/RoutesTransactionsSubscription.graphql";
import { RoutesUserSubscription } from "__generated__/RoutesUserSubscription.graphql";

const routesFragment = graphql`
  fragment Routes_user on User {
    id
    name
    apellidoPaterno
    apellidoMaterno
    investments {
      _id_loan
      quantity
      term
      ROI
      payments
    }
    accountAvailable
    ...Profile_user
    ...AddFunds_user
    ...RetireFunds_user
    ...AddLoan_user
    ...Settings_user
  }
`;

type Props = {
  user: Routes_user$key;
  data: AppQueryResponse;
  refetch: () => void;
};

interface IUserInvestments {
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
        name
        apellidoPaterno
        apellidoMaterno
        RFC
        CURP
        clabe
        mobile
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
  const user = useFragment(routesFragment, props.user);
  const user_gid = user.id;
  const environment = useRelayEnvironment();
  const configLoans = useMemo<
    GraphQLSubscriptionConfig<RoutesLoansSubscription>
  >(
    () => ({
      variables: { status: user_gid && getStatus() },
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
    [user_gid]
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
          investmentStatus === "on_going"
            ? (["UP_TO_DATE", "DELAY_PAYMENT"] as InvestmentStatus[])
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
  const { isBorrower, isSupport } = tokensAndData.data;
  const reducedInvestments = user.investments.reduce<IUserInvestments[]>(
    (acc, item) => {
      const index = acc.findIndex((acc) => acc._id_loan === item._id_loan);
      if (index === -1) {
        acc.push({ ...item, quantity: Number(item.quantity) * 100 });
      } else {
        acc[index].quantity += Number(item.quantity) * 100;
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
    }, 0) +
    Number(user.accountAvailable) * 100;
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
              <div>${(accountTotal / 100).toFixed(2)}</div>
              <div>Saldo disponible</div>
              <div>${user.accountAvailable}</div>
              <Link to="/profile">Mi cuenta</Link>
              <Link to="/addLoan">Pedir prestamo</Link>
              <Link to="/myLoans">Mis prestamos</Link>
              <Link to="/addFunds">Agregar fondos</Link>
              <Link to="/retireFunds">Retirar fondos</Link>
              <Link to="/settings">Settings</Link>
            </>
          ) : isSupport ? (
            <>
              <Link to="/approveLoan">Aprobar prestamo</Link>
              <Link to="/settings">Settings</Link>
            </>
          ) : (
            <>
              <div>Valor de la cuenta</div>
              <div>${(accountTotal / 100).toFixed(2)}</div>
              <div>Saldo disponible</div>
              <div>${user.accountAvailable}</div>
              <Link to="/profile">Mi cuenta</Link>
              <Link to="/addInvestments">Comprar</Link>
              <Link to="/addFunds">Agregar fondos</Link>
              <Link to="/retireFunds">Retirar fondos</Link>
              <Link to="/myInvestments">Mis Inversiones</Link>
              <Link to="/myTransactions">Mis movimientos</Link>
              <Link to="/settings">Settings</Link>
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
          {user.id !== "VXNlcjowMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=" ? (
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
                <Route path="/settings">
                  <Settings user={user} refetch={props.refetch} />
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
                <Route path="/settings">
                  <Settings user={user} refetch={props.refetch} />
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
                  <MyInvestments
                    data={props.data}
                    setInvestmentStatus={setInvestmentStatus}
                    investmentStatus={investmentStatus}
                  />
                </Route>
                <Route path="/settings">
                  <Settings user={user} refetch={props.refetch} />
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
