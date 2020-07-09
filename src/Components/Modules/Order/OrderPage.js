import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import { OrderList } from './';

export default function OrderPage({ match, history }) {
  const [title] = React.useState('Orders');
  const [listKey] = React.useState(1);

  // const handleOrderDialogComplete = message => {
  //   setListKey(listKey + 1);
  //   history.push('/orders');
  // };

  return (
    <DefaultLayout
      title={title}
    >
      <OrderList key={listKey} />

      {/*match.params.id && (
        <UserDialog
          userId={match.params.id}
          onComplete={handleOrderDialogComplete}
        />
      )*/}
    </DefaultLayout>
  );
};