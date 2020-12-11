import React from "react";
import {
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  makeStyles,
} from "@material-ui/core";
import PrintLayout from "../../Layout/PrintLayout";
import API from "../../../Services/API";
import { parseGLID, makeGLID } from "../../UI/GLID";
import NumberFormat from "react-number-format";
// import Currency from "../../UI/Currency";

export function PackingSlipPrintPage({ match }) {
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    API.Orders.get(parseGLID(match.params.id)).then((orderData) =>
      setOrder(orderData)
    );
  }, [match]);

  React.useEffect(() => {
    if (order) {
      window.print();
    }
  }, [order]);

  return (
    order && (
      <PrintLayout>
        <PackingSlip order={order} />
      </PrintLayout>
    )
  );
}

function PackingSlipCustomerAddress({ address }) {
  return (
    <div>
      <Typography variant="subtitle1">{address.street}</Typography>
      {address.secondary && (
        <Typography variant="subtitle1">{address.secondary}</Typography>
      )}
      <Typography>
        {address.city}, {address.state} {address.zip} {address.country}
      </Typography>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  itemTable: {
    "& th, & td": {
      fontSize: 12,
      lineHeight: "14px",
      whiteSpace: "nowrap",
    },
    "& thead th": {
      fontWeight: "bold",
    },
    "& td h5": {
      fontSize: 16,
      fontWeight: "bold",
    },
    marginBottom: "50px",
  },
}));

export default function PackingSlip({ order }) {
  const classes = useStyles();

  return (
    <Box>
      <Box mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h5">
              {order.customer.firstName} {order.customer.lastName}
            </Typography>
            <PackingSlipCustomerAddress address={order.customer.address} />
          </Grid>
          <Grid item xs={6}>
            <Typography align="right">
              <img
                src={process.env.REACT_APP_LOGO_URL}
                alt="GerberLabs"
              />
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h5">Order Details</Typography>
      <Typography paragraph>
        Please note: your shipment may come in multiple packages. This document
        details your entire order not the contents of this box.
      </Typography>

      <Table className={classes.itemTable}>
        <TableHead>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            <TableCell>Est. Area Per Board</TableCell>
            <TableCell>Layers</TableCell>
            <TableCell>Copper Weight</TableCell>
            <TableCell>Surface Finish</TableCell>
            <TableCell>Tg (&deg;C)</TableCell>
            <TableCell># Boards</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.items.map((item, index) => (
            <TableRow key={`item_${index}`}>
              <TableCell>
                <Typography variant="h6">
                  {makeGLID(order.glid) +
                    "-" +
                    String(item.ordinal).padStart(3, "0")}
                </Typography>
                {item.name}
              </TableCell>
              <TableCell>
                <NumberFormat
                  value={item.board.metrics.area}
                  displayType="text"
                  decimalScale={2}
                />{" "}
                mm<sup>2</sup>
              </TableCell>
              <TableCell>{item.board.metrics.layers}</TableCell>
              <TableCell>{item.options.copperWeight} oz</TableCell>
              <TableCell>{item.options.surfaceFinish}</TableCell>
              <TableCell>{item.options.tg} &deg;C</TableCell>
              <TableCell>{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="subtitle1">Questions or concerns?</Typography>

      <Typography variant="body2">
        Contact us at admin@gerberlabs.com
      </Typography>
    </Box>
  );
}
