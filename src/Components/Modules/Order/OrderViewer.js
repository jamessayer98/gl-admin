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
import OrderViewerToolbar from './OrderViewerToolbar';

const gridSpacing = 2;

const useStyles = makeStyles(theme => ({
  root: {},
  toolbar: {
    marginBottom: theme.spacing(3)
  },
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

export default function OrderViewer({ orderId, onOrderLoaded }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState(null);

  if (onOrderLoaded === undefined) {
    onOrderLoaded = () => { };
  }

  React.useEffect(() => {
    API.Orders.get(parseGLID(orderId)).then(orderData => {
      setOrder(orderData);
      onOrderLoaded(orderData);
    });
  }, [orderId]);

  function handleRefundAmountChange(amount) {
    API.Orders.update(parseGLID(orderId), {
      amounts: { ...order.amounts, refunded: amount }
    }).then(order => setOrder(order));
  }
  
  return order && (
    <div>
      <OrderViewerToolbar className={classes.toolbar} order={order} />

      <Grid
        className={classes.infoGrid}
        container
        spacing={gridSpacing}
        mx={3}
      >
        <Grid
          item
          className={classes.gridItem}
          xs={12}
          md={4}
        >
          <CustomerInfoPanel order={order} />
          <ShippingInfoPanel order={order} />
        </Grid>

        <Grid
          item
          className={classes.gridItem}
          xs={12}
          md={5}
        >
          <NotesInfoPanel order={order} />          
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