import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Main } from "./Main";
import { Options } from "./Options";

export const Routes = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li>
              <Link to="/options">Options</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/options">
            <Options />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
