import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import { CustomerList, CustomerDialog } from '.';

export default function CustomerPage({ match, history }) {
  const [title] = React.useState('Customers');
  const [listKey, setListKey] = React.useState(1);

  const handleCustomerDialogComplete = message => {
    setListKey(listKey + 1);
    history.push('/customers');
  };

  return (
    <DefaultLayout
      title={title}
    >
      <CustomerList key={listKey} history={history} />

      {match.params.id && (
        <CustomerDialog
          customerId={match.params.id}
          onComplete={handleCustomerDialogComplete}
        />
      )}
    </DefaultLayout>
  );
};