import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

import Auth from './Services/Auth';

import PrivateRoute from './Components/PrivateRoute';

import LoginPage from './Components/LoginPage';
import DashboardPage from './Components/DashboardPage';
import NotFoundPage from './Components/NotFoundPage';

import { UserPage } from './Components/Modules/User';
import { CustomerPage } from './Components/Modules/Customer';
import { OrderPage } from './Components/Modules/Order';
import { SettingsPage } from './Components/Modules/Settings';
import { CouponPage } from './Components/Modules/Coupon/';

import './Assets/style.css';

export default function App() {
  const snackbarProviderRef = React.useRef();

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
    <SnackbarProvider
      ref={snackbarProviderRef}
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={(key) => (
        <Button onClick={() => snackbarProviderRef.current.closeSnackbar(key)}>Dismiss</Button>
      )}
    >
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
            path="/coupons/:id?"
            component={CouponPage}
          />
          <PrivateRoute
            path="/orders"
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
    </SnackbarProvider>
  );
}
