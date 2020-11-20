import React from "react";
import { TextField as MuiTextField } from "@material-ui/core";
import { getFieldError } from "../../../Helpers/FormHelpers";

export default function InputField({
  field,
  form: { touched, errors },
  ...props
}) {
  const { wasTouched, errorMsg } = getFieldError(field.name, touched, errors);

  return (
    <MuiTextField
      error={wasTouched && errorMsg && true}
      helperText={wasTouched && errorMsg}
      {...field}
      {...props}
    />
  );
}
