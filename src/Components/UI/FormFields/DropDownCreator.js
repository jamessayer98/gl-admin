import React from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { getFieldError } from '../../../Helpers/FormHelpers'
import { fieldToTextField } from 'formik-material-ui';

const filter = createFilterOptions();

export default function DropDownCreator({ textFieldProps, createOption, onSelect, ...props }) {
  const { form: { setTouched, setFieldValue, ...form } } = props;
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name } = field;
  const { wasTouched, errorMsg } = getFieldError(name, form.touched, form.errors);

  return (
    <Autocomplete
      {...props}
      {...field}
      error={wasTouched && errorMsg && true}
      helperText={wasTouched && errorMsg}
      onChange={(_, value) => {
        onSelect(value).then(newValue => setFieldValue(name, newValue));
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (params.inputValue !== '') {
          // If we have an exact match, don't add the "Create" option
          for (let i = 0; i < filtered.length; i++) {
            if (filtered[i].label === params.inputValue) {
              return filtered;
            }
          }

          // Add the "Create" option
          filtered.push(createOption(params.inputValue));
        }

        return filtered;
      }}
      onBlur={() => setTouched({ [name]: true })}
      renderInput={props => (
        <TextField {...props} {...textFieldProps} helperText={helperText} error={error} />
      )}
    />
  );
}

// export default function DropDownCreator({ onCreate, field: { onChange, ...field }, form: { touched, errors }, ...props }) {
//   const { wasTouched, errorMsg } = getFieldError(field.name, touched, errors);

//   return (
//     <Autocomplete
//       variant="outlined"
//       error={wasTouched && errorMsg && true}
//       helperText={wasTouched && errorMsg}
//       onChange={(event, newValue) => {
//         if (newValue && newValue.value === null) {
//           onCreate(newValue.newValue);
//         }
//         onChange(event);
//       }}
//       filterOptions={(options, params) => {
//         const filtered = filter(options, params);

//         if (params.inputValue !== '') {
//           // If we have an exact match, don't add the "Create" option
//           for (let i = 0; i < filtered.length; i++) {
//             if (filtered[i].label === params.inputValue) {
//               return filtered;
//             }
//           }

//           // Add the "Create" option
//           filtered.push({
//             value: null,
//             newValue: params.inputValue,
//             label: `Create "${params.inputValue}"`,
//           });
//         }

//         return filtered;
//       }}
//       selectOnFocus
//       clearOnBlur
//       handleHomeEndKeys
//       {...field}
//       {...props}
//     />
//   );
// };