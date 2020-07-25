import React from 'react';
import { InputLabel, FormHelperText } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

export default function ButtonGroup({ field, form: { touched, errors }, ...props }) {
  const { label, dataSource, ...rest } = props
  const [buttonValue, setButtonValue] = React.useState(field.value);
  
  const handleChange = (event, newButtonValue) => {
    setButtonValue(newButtonValue);
  };

  let items = [];
  if (dataSource) {
    items = dataSource.map(item => (
        <ToggleButton key={item} value={item}>{item}</ToggleButton>
    ));
  }

  return (
    <React.Fragment>
      <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
      <ToggleButtonGroup
        value={buttonValue}
        exclusive
        onChange={handleChange}
        id={field.name}
        error={touched[field.name] && errors[field.name] && true}
        {...rest}
      >
        {items}
      </ToggleButtonGroup>
      <FormHelperText>{touched[field.name] && errors[field.name]}</FormHelperText>
    </React.Fragment>    
  );
};