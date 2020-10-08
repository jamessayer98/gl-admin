import React from 'react';

import { 
  AppBar, 
  Paper,
  Tab as MuiTab, 
  Tabs as MuiTabs,
  makeStyles
} from '@material-ui/core';

const useTabStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))

export function Tab({ id, label, index, value, children, ...props }) {
  const classes = useTabStyles();

  return (    
    <Paper
      elevation={0}
      className={classes.root}
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`${id}-${index}`}
      {...props}
    >
      {children}
    </Paper>
  )
}

// const useStyles = makeStyles(theme => ({
//   root: {}
// }));

export default function Tabs({ id, children, muiTabsProps, ...props }) {
  // const classes = useStyles();
  const [value, setValue] = React.useState(parseInt(localStorage.getItem(`tab_${id}`)) || 0);

  console.log(value);

  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        {...props}
      >
        <MuiTabs
          value={value}
          onChange={(event, newValue) => {
            localStorage.setItem(`tab_${id}`, newValue)
            setValue(newValue);
          }}
          {...muiTabsProps}
        >
          {children.map((child, index) => (
            <MuiTab
              key={`tab-${index}`}
              label={child.props.label}
              id={child.props.id}
              aria-controls={`${child.props.id}-${index}`}
            />
          ))}
        </MuiTabs>
      </AppBar>
      {children.map((child, index) => React.cloneElement(child, { index: index, value: value }))}
    </div>
  );
}