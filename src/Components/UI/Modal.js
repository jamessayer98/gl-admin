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

const useStyles = makeStyles((theme) => ({
  dialogTitleBox: {
    minWidth: 400,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center' 
  }
}));

export default function Modal({ title, onClose, toRoute, children }) {
  const classes = useStyles();
  let closeButton = null;

  if (toRoute !== undefined) {
    closeButton = (
      <RouterLink to={toRoute}>
        <IconButton
          edge="end"
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </RouterLink>
    );
  } else {
    closeButton = (
      <IconButton
        edge="end"
        aria-label="Close"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    );
  }

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
          <span>{title}</span>

          {closeButton}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
};