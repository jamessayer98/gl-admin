import React from 'react';

import { OrderList, OrderViewer } from './';
import PrivateRoute from '../../PrivateRoute';
import { Switch } from 'react-router-dom';
import DefaultLayout from '../../Layout/DefaultLayout';
import { PackingSlipPrintPage } from './PackingSlip';

function OrderListPage({ history }) {
  const [key] = React.useState(1);

  return (
    <DefaultLayout
      title="Orders"
      pageTitle="Orders"
    >
      <OrderList key={key} history={history} />
    </DefaultLayout>
  );
}

export default function OrderPage({ history, match }) {
  return (
    <Switch>
      <PrivateRoute exact path={`${match.path}/`} component={OrderListPage} />
      <PrivateRoute exact path={`${match.path}/:id`} component={OrderViewer} />
      <PrivateRoute exact path={`${match.path}/:id/packing-slip`} component={PackingSlipPrintPage} />
    </Switch>
  );
};