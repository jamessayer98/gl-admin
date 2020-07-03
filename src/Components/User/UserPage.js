import React from 'react';

import { DefaultLayout } from '../Layout';
import UserList from './UserList';

export default function UserPage() {
  const [title] = React.useState('Users');

  return (
    <DefaultLayout title={title}>
      <UserList />
    </DefaultLayout>
  );
};