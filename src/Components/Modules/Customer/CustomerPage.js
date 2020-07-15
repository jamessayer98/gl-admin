import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import Modal from '../../UI/Modal';
import { CustomerList, CustomerForm } from '.';

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
        <Modal
          title={`${match.params.id === 'new' ? "New" : "Edit"} Customer`}
          toRoute="/customers"
          >
          <CustomerForm
            customerId={match.params.id}
            onComplete={handleCustomerDialogComplete}
          />
        </Modal>
      )}
    </DefaultLayout>
  );
};