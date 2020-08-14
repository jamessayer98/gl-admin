import React from 'react';
import { FormControl, FormLabel, FormControlLabel, FormHelperText, Switch as MuiSwitch } from '@material-ui/core';
import { getFieldError } from '../../../Helpers/FormHelpers'

export default function Switch({ label, helperText, field: { value, ...field }, inputProps, form: { touched, errors }, ...props }) {
  const { wasTouched, errorMsg } = getFieldError(field.name, touched, errors);
  
  return (
    <FormControl
      component="fieldset"
      error={wasTouched && errorMsg && true}
      {...props}
    >
      {helperText && <FormLabel component="legend">{label}</FormLabel>}
      <FormControlLabel
        control={<MuiSwitch checked={value} {...field} {...inputProps}/>}
        label={helperText || label}
      />
      {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
    </FormControl>
  );
}