import React from 'react';
import { TextField as MuiTextField } from '@material-ui/core';

export function TextField({ field, form: { touched, errors }, ...props }) {
  return (
    <MuiTextField
      error={touched[field.name] && errors[field.name] && true}
      helperText={touched[field.name] && errors[field.name]}
      {...field}
      {...props}
    />
  );
};