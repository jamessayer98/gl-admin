import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Auth from '../Services/Auth';

export default function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => {
      const currentUser = Auth.currentUserValue;
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      }

      // authorised so return component
      return <Component {...props} />
    }} />
  );
}