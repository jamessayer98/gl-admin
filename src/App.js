import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';

import Auth from './Services/Auth';

import PrivateRoute from './Components/PrivateRoute';
import Login from './Components/Login';

import './Assets/style.css';

const NotFound = () => {
  return <h1>404 Not Found</h1>
};

const Dashboard = ({ history }) => {
  return (
    <div>
      <h1>You're in!</h1>
      <p>
        <Button onClick={() => {
          Auth.logout();
          history.push('/');
        }} color="primary" variant="contained">Log Out</Button>
      </p>
    </div>
  );
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
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
