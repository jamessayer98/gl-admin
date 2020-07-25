import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Box,
} from '@material-ui/core';
import API from '../../../Services/API';
import { parseGLID } from '../../UI/GLID';
import OrderItem from './OrderItem';
import {
  CustomerInfoPanel,
  ShippingInfoPanel,
  NotesInfoPanel,
  BillingInfoPanel,
  LogInfoPanel
} from './OrderInfoPanels';

const gridSpacing = 2;

const useStyles = makeStyles(theme => ({
  root: {},
  infoGrid: {
    marginBottom: theme.spacing(gridSpacing)
  },
  gridItem: {
    '& > :not(:last-child)': {
      marginBottom: theme.spacing(gridSpacing)
    }
  },
  itemCard: {
    marginBottom: theme.spacing(gridSpacing)
  }
}));

export default function OrderViewer({ orderId }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState(null);
  const [customer, setCustomer] = React.useState(null);

  React.useEffect(() => {
    API.Orders.get(parseGLID(orderId)).then(order => setOrder(order));
  }, [orderId]);

  React.useEffect(() => {
    if (order) {
      API.Customers.get(order.customerId).then(customer => setCustomer(customer));
    }
  }, [order]);

  function handleRefundAmountChange(amount) {
    API.Orders.update(parseGLID(orderId), {
      amounts: { ...order.amounts, refunded: amount }
    }).then(order => setOrder(order));
  }
  
  return order && (
    <div>
      <Grid
        className={classes.infoGrid}
        container
        spacing={gridSpacing}
      >
        <Grid
          item
          className={classes.gridItem}
          xs={12}
          md={4}
        >
          {customer && (
            <React.Fragment>
              <CustomerInfoPanel customer={customer} />
              <ShippingInfoPanel customer={customer} />
            </React.Fragment>
          )}
        </Grid>

        <Grid
          item
          className={classes.gridItem}
          xs={12}
          md={5}
        >
          <NotesInfoPanel notes={order.notes} />          
          <BillingInfoPanel order={order} onRefundAmountChange={handleRefundAmountChange} />
        </Grid>

        <Grid
          item
          className={classes.gridItem}
          xs={12}
          md={3}
        >
          <LogInfoPanel order={order} />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h5" element="h2" paragraph>Items</Typography>

        {order.items.map((item, index) => (
          <Card
            key={index}
            className={classes.itemCard}
          >
            <CardContent>
              <OrderItem order={order} item={item}/>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}