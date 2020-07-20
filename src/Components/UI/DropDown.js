import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DropDown({ field, form: { touched, errors }, ...props }) {
  const classes = useStyles();
  let items = null;
  if (props.dataSource) {
    items = props.dataSource.map(item => (
      <MenuItem value={item.state}>{item.state}</MenuItem>
    ));
  }
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id={`${field.name}-label`}>{props.label}</InputLabel>
      <Select
        labelId={`${field.name}-label`}
        id={field.name}
        error={touched[field.name] && errors[field.name] && true}
        helperText={touched[field.name] && errors[field.name]}
        {...field}
        {...props}
      >
        {items}
      </Select>
    </FormControl>    
  );
};