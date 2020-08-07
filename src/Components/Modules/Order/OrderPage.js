import React from 'react';

import { OrderList, OrderViewer } from './';
import PrivateRoute from '../../PrivateRoute';
import { Switch } from 'react-router-dom';
import { Skeleton } from '@material-ui/lab';
import GLID from '../../UI/GLID';
import DefaultLayout from '../../Layout/DefaultLayout';

function OrderListPage({ history }) {
  const [key] = React.useState(1);

  return (
    <DefaultLayout
      title="Orders"
    >
      <OrderList key={key} history={history} />
    </DefaultLayout>
  );
}

function OrderViewPage({ match }) {
  const [key] = React.useState(1);
  const [pageTitle, setPageTitle] = React.useState(<Skeleton variant="text" width={300}/>);

  const handleOrderLoaded = order => {
    setPageTitle(<span>Order: <GLID id={order.glid} /></span>);
  };

  return (
    <DefaultLayout
      title={pageTitle}
      padContent={false}
    >
      <OrderViewer key={key} orderId={match.params.id} onOrderLoaded={handleOrderLoaded} />
    </DefaultLayout>
  );
}

export default function OrderPage({ history, match }) {
  return (
    <Switch>
      <PrivateRoute exact path={`${match.path}/`} component={OrderListPage} />
      <PrivateRoute exact path={`${match.path}/:id`} component={OrderViewPage} />
    </Switch>
  );
};