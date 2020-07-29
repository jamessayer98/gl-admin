import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import Modal from '../../UI/Modal';
import { CustomerList, CustomerForm } from '.';
import { OrderList } from '../Order';

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
          title={`${match.params.id === 'new' ? "New" : ""} Customer Account`}
          toRoute="/customers"
          >
          <CustomerForm
            customerId={match.params.id}
            onComplete={handleCustomerDialogComplete}
          />
          {match.params.id === 'new' ? null :
            <OrderList customerId={match.params.id} hideCustomer readOnly />}
        </Modal>
      )}
    </DefaultLayout>
  );
};