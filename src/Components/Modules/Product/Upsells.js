import {
  Box,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React from "react";
import API from "../../../Services/API";

// Note: These options are hard-coded, but the data is set up to be dynamic.
//       For now we're assuming the hard-code in rendering the form

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

export default function Upsells() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [dirty, setDirty] = React.useState(false);
  const [upsells, setUpsells] = React.useState(null);

  const filterUpsells = (data) => {
    const _upsells = {};

    data.forEach((upsell) => {
      if (!Object.keys(_upsells).includes(upsell.option)) {
        _upsells[upsell.option] = [];
      }

      _upsells[upsell.option].push(upsell);
    });

    return _upsells; // Yikes, right?
  };

  const reduceUpsells = (data) => {
    const _upsells = [];

    Object.keys(data).forEach((key) => {
      _upsells.push(...data[key]);
    });

    return _upsells;
  };

  React.useEffect(() => {
    API.Settings.get("upsells").then((data) => setUpsells(filterUpsells(data)));
  }, []);

  const save = () => {
    if (!dirty) return;

    API.Settings.set("upsells", reduceUpsells(upsells)).then((data) => {
      enqueueSnackbar("Upsells saved", { variant: "success" });
      setDirty(false);
    });
  };

  let fieldProps = {
    onChange: (event) => {
      let _upsells = { ...upsells };

      let indexPieces = event.target.name.split(".");
      let option = _upsells[indexPieces[0]];

      option.map((upsell) => {
        if (String(upsell.value) === indexPieces[1]) {
          upsell.amount = event.target.value;
        }

        return upsell;
      });

      setUpsells(_upsells);
      setDirty(true);
    },
    onKeyDown: (event) => {
      if (event.which === 13) {
        save();
      } else {
        setDirty(true);
      }
    },
    onBlur: save,
  };

  return (
    upsells && (
      <Box>
        <Paper className={classes.paper}>
          <Typography paragraph>Copper Weight</Typography>
          <Grid container spacing={3}>
            {upsells.copperWeight.map((upsell, upsellIndex) => (
              <Grid item xs={4} key={upsellIndex}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name={`${upsell.option}.${upsell.value}`}
                  value={upsell.amount}
                  label={`${upsell.value} oz`}
                  {...fieldProps}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Typography paragraph>Surface Finish</Typography>
          <Grid container spacing={3}>
            {upsells.surfaceFinish.map((upsell, upsellIndex) => (
              <Grid item xs={4} key={upsellIndex}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name={`${upsell.option}.${upsell.value}`}
                  value={upsell.amount}
                  label={upsell.value}
                  {...fieldProps}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Typography paragraph>Tg</Typography>
          <Grid container spacing={3}>
            {upsells.tg.map((upsell, upsellIndex) => (
              <Grid item xs={4} key={upsellIndex}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name={`${upsell.option}.${upsell.value}`}
                  value={upsell.amount}
                  label={upsell.value}
                  {...fieldProps}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    )
  );
}
