import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Auth from './Services/Auth';

import PrivateRoute from './Components/PrivateRoute';

import LoginPage from './Components/LoginPage';
import DashboardPage from './Components/DashboardPage';
import NotFoundPage from './Components/NotFoundPage';

import { UserPage } from './Components/Modules/User';

import './Assets/style.css';

export default function App() {
  React.useEffect(() => {
    if (window.location.pathname !== '/') {
      Auth
        .heartbeat()
        .then(() => true)
        .catch(() => {
          Auth.logout();
          return <Redirect to="/" />;
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={LoginPage}
        />
        <PrivateRoute
          path="/dashboard"
          component={DashboardPage}
        />
        <PrivateRoute
          path="/users/:id?"
          component={UserPage}
        />
        <Route
          component={NotFoundPage}
        />
      </Switch>
    </BrowserRouter>
  );
}
