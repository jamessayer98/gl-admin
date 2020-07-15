import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Auth from './Services/Auth';

import PrivateRoute from './Components/PrivateRoute';

import LoginPage from './Components/LoginPage';
import DashboardPage from './Components/DashboardPage';
import NotFoundPage from './Components/NotFoundPage';

import { UserPage } from './Components/Modules/User';
import { CustomerPage } from './Components/Modules/Customer';
import { OrderPage } from './Components/Modules/Order';
import { SettingsPage } from './Components/Modules/Settings';

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
        <PrivateRoute
          path="/customers/:id?"
          component={CustomerPage}
        />
        <PrivateRoute
          path="/orders/:id?"
          component={OrderPage}
        />
        <PrivateRoute
          path="/settings"
          component={SettingsPage}
        />
        <Route
          component={NotFoundPage}
        />
      </Switch>
    </BrowserRouter>
  );
}
