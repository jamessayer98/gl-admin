import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';

import Auth from './Services/Auth';

import PrivateRoute from './Components/PrivateRoute';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import UserList from './Components/User';

import './Assets/style.css';

const NotFound = () => {
  return <h1>404 Not Found</h1>
};

const App = () => {
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
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/users" component={UserList} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
