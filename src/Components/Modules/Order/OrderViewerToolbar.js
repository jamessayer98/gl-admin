import React from "react";
import {
  Toolbar,
  makeStyles,
  Box,
  AppBar,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import SendToManufacturerButton from "./SendToManufacturerButton";
import API from "../../../Services/API";
import { Alert, Confirm } from "../../UI/Modal";
import Auth, { roles } from "../../../Services/Auth";

const useStyles = makeStyles((theme) => ({
  root: {},
  statusText: {
    marginRight: theme.spacing(2),
  },
  toolbarMainBox: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
}));

export default function OrderViewerToolbar({ order, onOrderChange, ...props }) {
  const classes = useStyles();
  const isMfg = Auth.currentUserRole === roles.manufacturer;
  const [orderStatus, setOrderStatus] = React.useState(order.status);
  const [newOrderStatus, setNewOrderStatus] = React.useState(null);
  const [statusAlertOpen, setAlertOpen] = React.useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = React.useState(false);
  const [statusError, setStatusError] = React.useState({
    title: "",
    message: "",
  });
  const [statusConfirmMessage, setStatusConfirmMessage] = React.useState({
    title: "",
    message: "",
  });

  React.useEffect(() => {
    setOrderStatus(order.status);
  }, [order]);

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    // Pending -> Processing
    // Must select mfg
    if (newStatus === "processing" && !order.manufacturerId) {
      setAlertOpen(true);
      setStatusError({
        title: "Unassigned Order",
        message:
          "You must select a manufacturer using the “Assign to Manufacturer” tool.",
      });
      return;
    }

    // Processing -> Shipped
    // All shipping info must be present, and items must be flagged as shipped
    if (newStatus === "shipped") {
      const itemsWithoutTrackingInfo = [];
      const itemsNotShipped = [];

      console.log("order <=> ", order);

      order.items.forEach((item) => {
        console.log("--=>", item);

        if (
          item.trackingAvailable &&
          (item.tracking === null || item.tracking === "")
        ) {
          itemsWithoutTrackingInfo.push(item);
        }

        if (!item.shipped) {
          itemsNotShipped.push(item);
        }
      });

      console.log(itemsWithoutTrackingInfo);

      // We actually do want to respond first with the missing info message here, do not combine.
      // Its almost certainly the case that if the info is missing, then the item isn't shipped
      // (and they'll just flag it as shipped when they update)

      if (itemsWithoutTrackingInfo.length > 0) {
        setAlertOpen(true);
        setStatusError({
          title: "Required Data Missing",
          message:
            "Please provide a tracking number or check the box that indicates a tracking number is not available.",
        });
        return;
      }

      if (itemsNotShipped.length > 0) {
        setAlertOpen(true);
        setStatusError({
          title: "Items not shipped",
          message: "Please ensure that all items are flagged as shipped",
        });
        return;
      }
    }

    switch (newStatus) {
      case "pending":
        setStatusConfirmMessage({
          title: "Going Backward?",
          message:
            "Are you sure you want to take this order back to the Pending Processing status?",
        });
        break;
      case "processing":
        setStatusConfirmMessage({
          title: "Send to Manufacturer?",
          message: "Are you sure you want send this order to the Manufacturer?",
        });
        break;
      case "shipped":
        setStatusConfirmMessage({
          title: "Mark as Shipped?",
          message: "Are you sure you want to mark this order as shipped?",
        });
        break;
      case "hold":
        setStatusConfirmMessage({
          title: "Put on Hold?",
          message: "Are you sure you want to put this order on hold?",
        });
        break;
      case "cancelled":
        setStatusConfirmMessage({
          title: "Mark as Canceled?",
          message: "Are you sure you want to mark this order as canceled?",
        });
        break;
      default:
        console.error("Unknown status: " + newStatus);
    }

    setStatusConfirmOpen(true);
    setNewOrderStatus(newStatus);
  };

  const saveStatus = () => {
    API.Orders.setStatus(order.glid, newOrderStatus).then((response) => {
      if (!response.success) {
        setStatusError(response);
        setAlertOpen(true);
      } else {
        setStatusError(null);
        setStatusConfirmOpen(false);
        setOrderStatus(newOrderStatus);
        onOrderChange();
      }
    });
  };

  return (
    <div>
      <AppBar position="relative" elevation={0} color="transparent" {...props}>
        <Toolbar>
          <Box className={classes.toolbarMainBox}>
            <Typography
              variant="h6"
              component="span"
              className={classes.statusText}
            >
              Status:
            </Typography>
            {!isMfg && (
              <Select
                value={orderStatus}
                onChange={handleStatusChange}
                disabled={orderStatus === "in_progress"}
              >
                <MenuItem value="in_progress" disabled={true}>
                  In Progress
                </MenuItem>
                <MenuItem value="pending">Pending Processing</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="hold">On Hold</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            )}
            {isMfg && (
              <Typography variant="h6" component="span">
                {orderStatus}
              </Typography>
            )}
          </Box>
          {!isMfg && (
            <SendToManufacturerButton
              order={order}
              onStatusChange={(status) => {
                setOrderStatus(status);
                onOrderChange();
              }}
            />
          )}
        </Toolbar>
      </AppBar>
      {statusError && (
        <Alert
          title={statusError.title}
          open={statusAlertOpen}
          onConfirm={() => setAlertOpen(false)}
        >
          <Typography>{statusError.message}</Typography>
        </Alert>
      )}
      {statusConfirmMessage && (
        <Confirm
          title={statusConfirmMessage.title}
          open={statusConfirmOpen}
          onConfirm={saveStatus}
          onCancel={() => setStatusConfirmOpen(false)}
        >
          <Typography>{statusConfirmMessage.message}</Typography>
        </Confirm>
      )}
    </div>
  );
}
