import React from "react";
import DashboardChart from "./Charts/DashboardChart";
import DefaultLayout from "./Layout/DefaultLayout";
import { Grid, Box, Button } from "@material-ui/core";
// import { useSnackbar } from 'notistack';
// import { Alert, Confirm } from './UI/Modal';

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
