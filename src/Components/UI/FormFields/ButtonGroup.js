import React from "react";
import { InputLabel, FormHelperText } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

export default function ButtonGroup({
  field,
  form: { touched, errors, setFieldValue },
  ...props
}) {
  const { label, dataSource, ...rest } = props;

  const handleChange = (event, newButtonValue) => {
    setFieldValue(field.name, newButtonValue);
  };

  let items = null;
  if (dataSource) {
    items = dataSource.map((item) => (
      <ToggleButton
        style={{ width: `${100 / dataSource.length}%` }}
        key={item}
        selected={item === field.value}
        value={item}
      >
        {item}
      </ToggleButton>
    ));
  }

  return (
    <React.Fragment>
      <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
      <ToggleButtonGroup
        style={{ width: "100%" }}
        exclusive
        onChange={handleChange}
        id={field.name}
        error={touched[field.name] && errors[field.name] && true}
        name={field.name}
        {...rest}
      >
        {items}
      </ToggleButtonGroup>
      <FormHelperText>
        {rest.message}
        {touched[field.name] && errors[field.name]}
      </FormHelperText>
    </React.Fragment>
  );
}
