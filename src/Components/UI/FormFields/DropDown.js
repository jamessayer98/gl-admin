import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, makeStyles, FormHelperText } from '@material-ui/core';
import { getFieldError } from '../../../Helpers/FormHelpers'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1)
  }
}));

export default function DropDown({ field, form: { touched, errors }, ...props }) {
  const { label, dataSource, dataKey, dataValue, ...rest } = props
  const classes = useStyles();
  let items = null;

  const {wasTouched, errorMsg} = getFieldError(field.name, touched, errors)

  if (dataSource) {
    items = dataSource.map(item => (
      <MenuItem key={item[dataValue]} value={item[dataValue]}>{item[dataKey]}</MenuItem>
    ));
  }
  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      fullWidth
      error={wasTouched && errorMsg && true}
    >
      <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${field.name}-label`}
        {...field}
        {...rest}
      >
        {items}
      </Select>
      <FormHelperText>{wasTouched && errorMsg}</FormHelperText>
    </FormControl>    
  );
};