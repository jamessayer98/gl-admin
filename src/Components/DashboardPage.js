import React from 'react';
import {
  Typography, Button
} from '@material-ui/core';

import DefaultLayout from './Layout/DefaultLayout';
import { useSnackbar } from 'notistack';
import { Alert, Confirm } from './UI/Modal';

export default function DashboardPage({ history }) {
  const { enqueueSnackbar } = useSnackbar();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <DefaultLayout
      title="Dashboard"
    >
      <Typography paragraph>
        Welcome to the Gerber Labs Management Portal!
      </Typography>

      <Typography paragraph>
        <Button variant="contained" color="primary" onClick={() => enqueueSnackbar('Success! You clicked the button!', { variant: 'success' })}>Example Notification</Button>
      </Typography>

      <Typography paragraph>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setAlertOpen(true)}
        >
          Example Alert
        </Button>
      </Typography>
      <Alert
        title="Example Alert Title"
        open={alertOpen}
        onConfirm={() => {
          console.log('Alert confirmed')
          setAlertOpen(false);
        }}
      >
        <Typography>This is a message where you can only confirm.</Typography>
      </Alert>

      <Typography paragraph>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setConfirmOpen(true)}
        >
          Example Confirm
        </Button>
      </Typography>
      <Confirm
        title="Example Confirm Title"
        open={confirmOpen}
        onConfirm={() => {
          console.log('Confirm confirmed');
          setConfirmOpen(false);
        }}
        onCancel={() => {
          console.log('Confirm cancelled');
          setConfirmOpen(false);
        }}
      >
        <Typography>This is a message where you can cancel or confirm.</Typography>
      </Confirm>

    </DefaultLayout>
  );
};