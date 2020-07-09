import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import { UserList, UserDialog } from './';

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
        <UserDialog
          userId={match.params.id}
          onComplete={handleUserDialogComplete}
        />
      )}
    </DefaultLayout>
  );
};