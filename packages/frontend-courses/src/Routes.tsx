import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Main } from "./Main";
import { Options } from "./Options";
import { graphql, useFragment } from "react-relay";
import { Routes_user$key } from "./__generated__/Routes_user.graphql";
import { GeneralData, DebtInSale } from "./screens";

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
        <div style={{ border: "1px solid black" }}>
          <div>Valor de la cuenta</div>
          <div>${(user.accountTotal / 100).toFixed(2)}</div>
          <div>Saldo disponible</div>
          <div>${(user.accountAvailable / 100).toFixed(2)}</div>
          <div>Mi cuenta</div>
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
          <Link
            to="/profile"
            style={{ textAlign: "end" }}
          >{`${user.name} ${user.apellidoPaterno} ${user.apellidoMaterno}`}</Link>
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
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};
