import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Auth, { roles } from '../Services/Auth';

export default function PrivateRoute({ component: Component, isAdminRoute, ...rest }) {
  return (
    <Route {...rest} render={props => {
      const currentUser = Auth.currentUserValue;
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      }

      if (isAdminRoute && currentUser.role === roles.manufacturer) {
        return <Redirect to={{ pathname: '/', state: { flash: 'Access denied' } }} />
      }

      // authorised so return component
      return <Component {...props} />
    }} />
  );
}