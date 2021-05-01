import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Main } from "./Main";
import { Options } from "./Options";
import { graphql, useFragment } from "react-relay";
import { Routes_user$key } from "./__generated__/Routes_user.graphql";
import { GeneralData, DebtInSale, LogIn, SignUp } from "./screens";

const routesFragment = graphql`
  fragment Routes_user on User {
    name
    apellidoPaterno
    apellidoMaterno
    accountTotal
    accountAvailable
    ...GeneralData_user
  }
`;

type Props = {
  user: Routes_user$key;
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
          <Link to="/debtinsale">Comprar</Link>
          <div>Agregar fondos</div>
          <div>Retirar fondos</div>
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
          {user.name ? (
            <>
              <Link
                to="/profile"
                style={{ textAlign: "end" }}
              >{`${user.name} ${user.apellidoPaterno} ${user.apellidoMaterno}`}</Link>
              <div
                style={{ textAlign: "end" }}
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
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
              <Route path="/debtinsale">
                <DebtInSale />
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
