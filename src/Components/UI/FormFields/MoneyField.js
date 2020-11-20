import React from "react";
import { TextField as MuiTextField, InputAdornment } from "@material-ui/core";
import { getFieldError } from "../../../Helpers/FormHelpers";

// let timeoutId = null;

export default function MoneyField({
  field,
  form: { touched, errors },
  ...props
}) {
  const ref = React.useRef();
  const { wasTouched, errorMsg } = getFieldError(field.name, touched, errors);

  // const _onChange = field.onChange;

  // field.onChange = (event) => {
  //   if (timeoutId)
  //     clearTimeout(timeoutId);

  //   timeoutId = setTimeout(() => {
  //     ref.current.value = Number(ref.current.value).toFixed(2);
  //     timeoutId = null;
  //   }, 500);

  //   _onChange(event);
  // };

  if (!props.inputProps) {
    props.inputProps = {};
  }

  props.inputProps.ref = ref;

  if (!props.InputProps) {
    props.InputProps = {};
  }

  props.InputProps.startAdornment = (
    <InputAdornment position="start">$</InputAdornment>
  );

  return (
    <MuiTextField
      error={wasTouched && errorMsg && true}
      helperText={wasTouched && errorMsg}
      {...field}
      {...props}
    />
  );
}
