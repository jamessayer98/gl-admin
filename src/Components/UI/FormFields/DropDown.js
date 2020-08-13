import React from 'react';
import { Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@material-ui/core';
import { getFieldError } from '../../../Helpers/FormHelpers'

export default function DropDown({ field, form: { touched, errors }, ...props }) {
  const { label, dataSource, dataKey, dataValue, ...rest } = props;
  let items = null;

  const { wasTouched, errorMsg } = getFieldError(field.name, touched, errors)

  if (dataSource) {
    if (dataKey && dataValue) {
      items = dataSource.map((item, index) => (
        <MenuItem key={index} value={item[dataValue]}>{item[dataKey]}</MenuItem>
      ));
    } else {
      items = dataSource.map((item, index) => (
        <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
      ));
    }
  }

  return (
    <FormControl
      variant="outlined"
      error={wasTouched && errorMsg && true}
      {...rest}
    >
      <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${field.name}-label`}
        {...field}
      >
        {items}
      </Select>
      <FormHelperText>{wasTouched && errorMsg}</FormHelperText>
    </FormControl>    
  );
};