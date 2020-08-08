import React from 'react';
import { Toolbar, makeStyles, Box, AppBar } from '@material-ui/core';
import SendToManufacturerButton from './SendToManufacturerButton';

const useStyles = makeStyles(theme => ({
  root: {

  },
  toolbarMainBox: {
    flexGrow: 1
  }
}));

export default function OrderViewerToolbar({ order, ...props }) {
  const classes = useStyles();

  return (
    <AppBar position="relative" elevation={0} color="transparent" {...props}>
      <Toolbar >
        <Box className={classes.toolbarMainBox}>
          Status
        </Box>
        <SendToManufacturerButton order={order} />
      </Toolbar>
    </AppBar>
  );
};