import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent,
  IconButton, Box,
  makeStyles,
  DialogActions,
  Button
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

export default function Modal({ title, onClose, toRoute, children, ...props }) {
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
      {...props}
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

export function Alert({ title, open, onConfirm, children }) {
  if (onConfirm === undefined) {
    onConfirm = () => { };
  }
  
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onConfirm()}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export function Confirm({ title, open, onConfirm, onCancel, children }) {
  if (onConfirm === undefined) {
    onConfirm = () => { };
  }

  if (onCancel === undefined) {
    onConfirm = () => { };
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm()}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}