import React from "react";
// import Chart from "react-google-charts";
import {
  Typography,
  // Grid,
  Paper,
  makeStyles,
  // Box,
  // Button,
} from "@material-ui/core";

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

const DashboardChart = ({ title }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography gutterBottom variant="h6">
        {title}
      </Typography>

      {/* <div style={{ display: "flex", maxWidth: 900 }}>
        <Chart
          width={400}
          height={300}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["City", "2010 Population", "2000 Population"],
            ["New York City, NY", 8175000, 8008000],
            ["Los Angeles, CA", 3792000, 3694000],
            ["Chicago, IL", 2695000, 2896000],
            ["Houston, TX", 2099000, 1953000],
            ["Philadelphia, PA", 1526000, 1517000],
          ]}
          options={{
            title: "Population of Largest U.S. Cities",
            chartArea: { width: "30%" },
            hAxis: {
              title: "Total Population",
              minValue: 0,
            },
            vAxis: {
              title: "City",
            },
          }}
          legendToggle
        />
      </div>
      <div style={{ display: "flex" }}>
        <Chart
          width={400}
          height={300}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            [
              { type: "number", label: "x" },
              { type: "number", label: "values" },
              { id: "i0", type: "number", role: "interval" },
              { id: "i1", type: "number", role: "interval" },
              { id: "i2", type: "number", role: "interval" },
              { id: "i2", type: "number", role: "interval" },
              { id: "i2", type: "number", role: "interval" },
              { id: "i2", type: "number", role: "interval" },
            ],
            [1, 100, 90, 110, 85, 96, 104, 120],
            [2, 120, 95, 130, 90, 113, 124, 140],
            [3, 130, 105, 140, 100, 117, 133, 139],
            [4, 90, 85, 95, 85, 88, 92, 95],
            [5, 70, 74, 63, 67, 69, 70, 72],
            [6, 30, 39, 22, 21, 28, 34, 40],
            [7, 80, 77, 83, 70, 77, 85, 90],
            [8, 100, 90, 110, 85, 95, 102, 110],
          ]}
          options={{
            intervals: { style: "sticks" },
            legend: "none",
          }}
        />
      </div> */}
    </Paper>
  );
};

export default DashboardChart;
