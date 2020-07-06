import React from 'react';
import {
  Typography
} from '@material-ui/core';

import DefaultLayout from './Layout/DefaultLayout';

export default function DashboardPage({ history }) {
  return (
    <DefaultLayout
      title="Dashboard"
    >
      <Typography>
        Welcome to the Gerber Labs Management Portal!
      </Typography>
    </DefaultLayout>
  );
};