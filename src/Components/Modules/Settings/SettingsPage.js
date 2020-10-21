import React from 'react';
import {
  Paper,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import DefaultLayout from '../../Layout/DefaultLayout';
import { Skeleton } from '@material-ui/lab';
import API from '../../../Services/API';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3)
  }
}));

export default function SettingsPage() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [title] = React.useState('Settings');
  const [adminEmails, setAdminEmails] = React.useState('');
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    API.Settings.get('adminEmails').then(data => data ? setAdminEmails(data.value) : setAdminEmails(''));
  }, []);

  const save = () => {
    if (!dirty) return;

    API.Settings.set('adminEmails', { value: adminEmails }).then(() => {
      setDirty(false);
      enqueueSnackbar('Admin emails updated', { variant: 'success' });
    });  
  };

  return (
    <DefaultLayout
      title={title}
      pageTitle="Settings"
    >
      <Paper className={classes.paper}>
        <Typography paragraph variant="h5">Admin Emails</Typography>
        {adminEmails !== null && <TextField
          variant="outlined"
          value={adminEmails}
          fullWidth
          label="Deliver admin emails to"
          onChange={(event) => {
            setAdminEmails(event.target.value);
          }}
          onBlur={save}
          onKeyDown={(event) => {
            if (event.which === 13) {
              // enter
              save();
            } else {              
              setDirty(true);
            }
          }}
        />}
        {adminEmails === null && <Skeleton><TextField /></Skeleton>}
      </Paper>
    </DefaultLayout>
  );
};