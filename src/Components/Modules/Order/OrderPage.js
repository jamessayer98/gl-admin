import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import { OrderList, OrderViewer } from './';
import PrivateRoute from '../../PrivateRoute';
import { Switch } from 'react-router-dom';

function OrderListPage({ history }) {
  const [key] = React.useState(1);
  return <OrderList key={key} history={history}/>;
}

function OrderViewPage({ match }) {
  const [key] = React.useState(1);
  return <OrderViewer key={key} orderId={match.params.id} />;
}

export default function OrderPage({ match }) {
  const [title] = React.useState('Orders');

  return (
    <DefaultLayout
      title={title}
    >
      <Switch>
        <PrivateRoute exact path={`${match.path}/`} component={OrderListPage} />
        <PrivateRoute exact path={`${match.path}/:id`} component={OrderViewPage} />
      </Switch>
    </DefaultLayout>
  );
};