import React from "react";
import {
  TextField,
  makeStyles,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Edit as EditIcon, Save as SaveIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    marginRight: theme.spacing(1),
  },
}));

export default function EditableText({
  label,
  value,
  valuePrefix,
  onSave,
  ...props
}) {
  const classes = useStyles();
  const [editable, setEditable] = React.useState(false);
  const [valueState, setValueState] = React.useState(value);

  const handleIconClick = (event) => {
    if (editable) {
      onSave(valueState);
    }

    setEditable(!editable);
  };

  const text = () => {
    let inputProps = {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleIconClick}>
            {editable ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </InputAdornment>
      ),
    };

    if (valuePrefix) {
      inputProps.startAdornment = (
        <InputAdornment position="start">{valuePrefix}</InputAdornment>
      );
    }

    return (
      <TextField
        value={valueState}
        disabled={!editable}
        InputProps={inputProps}
        onChange={(event) => setValueState(event.target.value)}
        {...props}
      />
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        <span>{label}</span>
      </div>
      {text()}
    </div>
  );
}
