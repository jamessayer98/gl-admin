import React from "react";
import {
  Typography,
  Grid,
  Paper,
  makeStyles,
  Box,
  Button,
} from "@material-ui/core";

import DefaultLayout from "./Layout/DefaultLayout";
// import { useSnackbar } from 'notistack';
// import { Alert, Confirm } from './UI/Modal';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  graph: {
    height: 250,
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[300],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(3),
    "& > p": {
      color: theme.palette.common.white,
      fontSize: 18,
      textAlign: "center",
    },
  },
}));

function DashboardChart({ title }) {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography gutterBottom variant="h6">
        {title}
      </Typography>

      <Box variant="rect" className={classes.graph}>
        <Typography>
          This chart will display when sufficient data is available
        </Typography>
      </Box>
    </Paper>
  );
}

export default function DashboardPage({ history }) {
  // const { enqueueSnackbar } = useSnackbar();
  // const [alertOpen, setAlertOpen] = React.useState(false);
  // const [confirmOpen, setConfirmOpen] = React.useState(false);

  const cols = {
    xl: 3,
    lg: 4,
    md: 6,
    xs: 12,
  };

  return (
    <DefaultLayout title="Dashboard">
      <Grid container spacing={3}>
        <Grid item {...cols}>
          <DashboardChart title="Average Days to Ship by Week" />
        </Grid>
        <Grid item {...cols}>
          <DashboardChart title="Copper Weight Split" />
        </Grid>
        <Grid item {...cols}>
          <DashboardChart title="Surface Split" />
        </Grid>
        <Grid item {...cols}>
          <DashboardChart title="Refund % by Week" />
        </Grid>
        <Grid item {...cols}>
          <DashboardChart title="Tg Split" />
        </Grid>
        <Grid item {...cols}>
          <Box
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              href="https://analytics.google.com/analytics/web/#/report-home/a168615202w235024664p220266273"
              target="_blank"
              variant="contained"
              size="large"
              color="secondary"
            >
              Google Analytics
            </Button>
          </Box>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
}
