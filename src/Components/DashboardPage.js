import React from 'react';
import {
  Typography, Button
} from '@material-ui/core';

import DefaultLayout from './Layout/DefaultLayout';
import { useSnackbar } from 'notistack';

export default function DashboardPage({ history }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <DefaultLayout
      title="Dashboard"
    >
      <Typography>
        Welcome to the Gerber Labs Management Portal!
      </Typography>
      <Button variant="contained" color="primary" onClick={() => enqueueSnackbar('Success! You clicked the button!', { variant: 'success' })}>Example Notification</Button>
    </DefaultLayout>
  );
};