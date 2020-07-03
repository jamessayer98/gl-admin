import React from 'react';
import {
  Typography
} from '@material-ui/core';

import { DefaultLayout } from '../Layout';
import UserList from './UserList';

export default function UserPage() {
  const [title, setTitle] = React.useState('Users');

  return (
    <DefaultLayout title={title}>
      <UserList />
    </DefaultLayout>
  );
};