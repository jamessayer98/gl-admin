import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import Modal from '../../UI/Modal';
import { UserList, UserForm } from './';

export default function UserPage({ match, history }) {
  const [title] = React.useState('Users');
  const [listKey, setListKey] = React.useState(1);

  const handleUserDialogComplete = message => {
    setListKey(listKey + 1);
    history.push('/users');
  };

  return (
    <DefaultLayout
      title={title}
    >
      <UserList key={listKey} history={history} />

      {match.params.id && (
        <Modal
          title={`${match.params.id === 'new' ? "New" : "Edit"} User`}
          toRoute="/users"
        >
          <UserForm 
            userId={match.params.id}
            onComplete={handleUserDialogComplete}
          />
        </Modal>
      )}
    </DefaultLayout>
  );
};