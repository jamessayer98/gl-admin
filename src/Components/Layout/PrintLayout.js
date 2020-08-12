import React from 'react';
import { CssBaseline, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    color: 'black',
    width: '100%',
    minHeight: '100%',
    padding: theme.spacing(3)
  }
}));

export default function PrintLayout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      {children}
    </div>
  );
}