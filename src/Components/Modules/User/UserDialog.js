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

import UserForm from './UserForm';

const useStyles = makeStyles((theme) => ({
  dialogTitleBox: {
    minWidth: 400,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center' 
  }
}));

export default function UserDialog({ userId, onComplete }) {
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
          <span>{(userId === 'new' ? 'New' : 'Edit')} User</span>

          <RouterLink to="/users">
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
        <UserForm
          userId={userId}
          onComplete={onComplete}
        />
      </DialogContent>
    </Dialog>
  );
};