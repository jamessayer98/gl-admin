import React from 'react';
import { Toolbar, makeStyles, Box, AppBar, MenuItem, Select, Typography } from '@material-ui/core';
import SendToManufacturerButton from './SendToManufacturerButton';
import API from '../../../Services/API';
import { Alert } from '../../UI/Modal';
import Auth, { roles } from '../../../Services/Auth';

const useStyles = makeStyles(theme => ({
  root: {

  },
  statusText: {
    marginRight: theme.spacing(2)
  },
  toolbarMainBox: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  }
}));

export default function OrderViewerToolbar({ order, ...props }) {
  const classes = useStyles();
  const isMfg = Auth.currentUserRole === roles.manufacturer;
  const [orderStatus, setOrderStatus] = React.useState(order.status);
  const [statusAlertOpen, setStatusAlertOpen] = React.useState(false);
  const [statusError, setStatusError] = React.useState('');

  const handleStatusChange = (event) => {
    API.Orders.setStatus(order.glid, event.target.value).then(response => {
      if (!response.success) {
        setStatusError(response.message);
        setStatusAlertOpen(true);
      } else {
        setOrderStatus(event.target.value);
      }
    });
  };

  return (
    <div>
      <AppBar position="relative" elevation={0} color="transparent" {...props}>
        <Toolbar >
          <Box className={classes.toolbarMainBox}>
            <Typography variant="h6" component="span" className={classes.statusText}>Status:</Typography>
            {!isMfg && (
              <Select
                value={orderStatus}
                onChange={handleStatusChange}
                disabled={orderStatus == 'in_progress'}
              >
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="pending">Pending Processing</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="hold">On Hold</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            )}
            {isMfg && <Typography variant="h6" component="span">{orderStatus}</Typography>}
          </Box>
          {!isMfg && <SendToManufacturerButton order={order} />}
        </Toolbar>
      </AppBar>
      <Alert title="Status Change Error" open={statusAlertOpen} onConfirm={() => setStatusAlertOpen(false)}>
        <Typography>{statusError}</Typography>
      </Alert>
    </div>
  );
};