import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Box,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import API from "../../../Services/API";
import GLID, { makeGLID, parseGLID } from "../../UI/GLID";
import OrderItem from "./OrderItem";
import {
  CustomerInfoPanel,
  ShippingInfoPanel,
  NotesInfoPanel,
  BillingInfoPanel,
  LogInfoPanel,
} from "./OrderInfoPanels";
import OrderViewerToolbar from "./OrderViewerToolbar";
import DefaultLayout from "../../Layout/DefaultLayout";
import PackingSlipButton from "./PackingSlipButton";
import Auth, { roles } from "../../../Services/Auth";

const gridSpacing = 2;

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: {
    marginBottom: theme.spacing(3),
  },
  infoGrid: {
    marginBottom: theme.spacing(gridSpacing),
  },
  gridItem: {
    "& > :not(:last-child)": {
      marginBottom: theme.spacing(gridSpacing),
    },
  },
  itemCard: {
    marginBottom: theme.spacing(gridSpacing),
  },
}));

export default function OrderViewer({ match }) {
  const classes = useStyles();
  const isMfg = Auth.currentUserRole === roles.manufacturer;
  const [order, setOrder] = React.useState(null);
  const [pageTitle, setPageTitle] = React.useState(
    <Skeleton variant="text" width={300} />
  );
  const [upsells, setUpsells] = React.useState(null);

  React.useEffect(() => {
    API.Orders.get(parseGLID(match.params.id)).then((orderData) => {
      setOrder(orderData);
      setPageTitle(
        <span>
          Order: <GLID id={orderData.glid} />
        </span>
      );
    });

    API.Settings.get("upsells").then((upsells) => {
      setUpsells(upsells);
    });
  }, [match]);

  function handleRefundAmountChange(amount) {
    API.Orders.update(order.glid, {
      amounts: { ...order.amounts, refunded: amount },
    }).then((orderData) => setOrder(orderData));
  }

  const handleOrderChange = () => {
    API.Orders.get(order.glid).then((orderData) => {
      setOrder(orderData);
    });
  };

  return (
    order && (
      <DefaultLayout
        title={pageTitle}
        pageTitle={`Order ${order ? makeGLID(order.glid) : ""}`}
        padContent={false}
      >
        <OrderViewerToolbar
          className={classes.toolbar}
          order={order}
          onOrderChange={handleOrderChange}
        />

        <Box px={3}>
          <Grid className={classes.infoGrid} container spacing={gridSpacing}>
            <Grid item className={classes.gridItem} xs={12} md={4}>
              <CustomerInfoPanel
                order={order}
                editable={!isMfg}
                onOrderChange={handleOrderChange}
              />
              <ShippingInfoPanel
                order={order}
                editable={!isMfg}
                onOrderChange={handleOrderChange}
              />
              {isMfg && <PackingSlipButton order={order} />}
            </Grid>

            <Grid item className={classes.gridItem} xs={12} md={5}>
              {!isMfg && <NotesInfoPanel order={order} />}
              {!isMfg && (
                <BillingInfoPanel
                  order={order}
                  onOrderChange={handleOrderChange}
                  onRefundAmountChange={handleRefundAmountChange}
                />
              )}
            </Grid>

            <Grid item className={classes.gridItem} xs={12} md={3}>
              <LogInfoPanel order={order} />
            </Grid>
          </Grid>

          <Box>
            <Typography variant="h5" element="h2" paragraph>
              Items
            </Typography>

            {order.items.map((item, index) => (
              <Card key={index} className={classes.itemCard}>
                <CardContent>
                  <OrderItem
                    order={order}
                    item={item}
                    upsells={upsells}
                    onOrderChange={handleOrderChange}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </DefaultLayout>
    )
  );
}
