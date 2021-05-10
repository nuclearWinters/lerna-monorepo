import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Main } from "./Main";
import { Options } from "./Options";
import {
  graphql,
  useFragment,
  commitLocalUpdate,
  Environment,
} from "react-relay";
import { Routes_user$key } from "./__generated__/Routes_user.graphql";
import {
  GeneralData,
  DebtInSale,
  LogIn,
  SignUp,
  AddFunds,
  RetireFunds,
} from "./screens";
import { RelayEnvironment } from "RelayEnvironment";
import { AppQueryResponse } from "__generated__/AppQuery.graphql";
import { AddLoan } from "screens/AddLoan";

const routesFragment = graphql`
  fragment Routes_user on User {
    id
    name
    apellidoPaterno
    apellidoMaterno
    accountTotal
    accountAvailable
    ...GeneralData_user
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

export const Routes: FC<Props> = (props) => {
  const user = useFragment(routesFragment, props.user);
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
          <div>Valor de la cuenta</div>
          <div>${(user.accountTotal / 100).toFixed(2)}</div>
          <div>Saldo disponible</div>
          <div>${(user.accountAvailable / 100).toFixed(2)}</div>
          <Link to="/profile">Mi cuenta</Link>
          <Link to="/loans">Comprar</Link>
          <Link to="/addFunds">Agregar fondos</Link>
          <Link to="/retireFunds">Retirar fondos</Link>
          <Link to="/addLoan">Pedir prestamo</Link>
          <div>Mis movimientos</div>
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
                  commitDeleteTokensLocally(RelayEnvironment);
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
            <Switch>
              <Route exact path="/">
                <Main />
              </Route>
              <Route path="/options">
                <Options />
              </Route>
              <Route path="/profile">
                <GeneralData user={user} />
              </Route>
              <Route path="/loans">
                <DebtInSale user={{ id: user.id }} data={props.data} />
              </Route>
              <Route path="/addFunds">
                <AddFunds user={user} />
              </Route>
              <Route path="/retireFunds">
                <RetireFunds user={user} />
              </Route>
              <Route path="/addLoan">
                <AddLoan user={user} />
              </Route>
              <Route path="/login">
                <LogIn refetch={props.refetch} />
              </Route>
              <Route path="/register">
                <SignUp refetch={props.refetch} />
              </Route>
            </Switch>
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
