import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent,
  IconButton, Box,
  makeStyles
} from '@material-ui/core';
import {
  Close as CloseIcon
} from '@material-ui/icons';

import CustomerForm from './CustomerForm';

const useStyles = makeStyles((theme) => ({
  dialogTitleBox: {
    minWidth: 400,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center' 
  }
}));

export default function CustomerDialog({ customerId, onComplete }) {
  const classes = useStyles();

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={true}
    >
      <DialogTitle>
        <Box
          className={classes.dialogTitleBox}
        >          
          <span>{(customerId === 'new' ? 'New' : 'Edit')} Customer</span>

          <RouterLink to="/customers">
            <IconButton
              edge="end"
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </RouterLink>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
      >
        <CustomerForm
          customerId={customerId}
          onComplete={onComplete}
        />
      </DialogContent>
    </Dialog>
  );
};