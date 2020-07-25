import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, makeStyles, FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1)
  }
}));

export default function DropDown({ field, form: { touched, errors }, ...props }) {
  const { label, dataSource, dataKey, dataValue, ...rest } = props
  const classes = useStyles();
  let items = null;

  let errorMsg = ''
  let wasTouched = false  
  if (field.name.includes('.')) {
    const props = field.name.split('.')
    wasTouched = touched[props[0]] ? touched[props[0]][props[1]] : wasTouched
    errorMsg = errors[props[0]] ? errors[props[0]][props[1]] : errorMsg
  }
  else {
    wasTouched = touched[field.name]
    errorMsg = errors[field.name]
  }

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
        id={field.name}
        {...field}
        {...rest}
      >
        {items}
      </Select>
      <FormHelperText>{errorMsg}</FormHelperText>
    </FormControl>    
  );
};