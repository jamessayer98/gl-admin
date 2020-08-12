import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Box
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import API from '../../../Services/API';
import GLID, { parseGLID } from '../../UI/GLID';
import OrderItem from './OrderItem';
import {
  CustomerInfoPanel,
  ShippingInfoPanel,
  NotesInfoPanel,
  BillingInfoPanel,
  LogInfoPanel
} from './OrderInfoPanels';
import OrderViewerToolbar from './OrderViewerToolbar';
import DefaultLayout from '../../Layout/DefaultLayout';
import PackingSlipButton from './PackingSlipButton';
import Auth, { roles } from '../../../Services/Auth';

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

export default function OrderViewer({ match, onOrderLoaded }) {
  const classes = useStyles();
  const isMfg = Auth.currentUserRole === roles.manufacturer;
  const [order, setOrder] = React.useState(null);
  const [pageTitle, setPageTitle] = React.useState(<Skeleton variant="text" width={300} />);

  React.useEffect(() => {
    API.Orders.get(parseGLID(match.params.id)).then(orderData => {
        setOrder(orderData);
        setPageTitle(<span>Order: <GLID id={orderData.glid} /></span>);
    });
  }, [match]);

  function handleRefundAmountChange(amount) {
    API.Orders.update(order.glid, {
      amounts: { ...order.amounts, refunded: amount }
    }).then(orderData => setOrder(orderData));
  }
  
  return order && (
    <DefaultLayout
      title={pageTitle}
      padContent={false}
    >
      <OrderViewerToolbar className={classes.toolbar} order={order} />
      <Box px={3}>
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
            <CustomerInfoPanel order={order} editable={!isMfg}/>
            <ShippingInfoPanel order={order} editable={!isMfg}/>
            {isMfg && <PackingSlipButton order={order} />}
          </Grid>

          <Grid
            item
            className={classes.gridItem}
            xs={12}
            md={5}
          >
            {!isMfg && <NotesInfoPanel order={order} />}
            {!isMfg && <BillingInfoPanel order={order} onRefundAmountChange={handleRefundAmountChange} />}
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
                <OrderItem order={order} item={item} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>      
    </DefaultLayout>
  );
}