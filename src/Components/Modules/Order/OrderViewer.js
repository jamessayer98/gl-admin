import React from 'react';
import {
  Grid,
  Typography,
  Card,
  IconButton,
  CardContent,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon
} from '@material-ui/icons';
import API from '../../../Services/API';
import { parseGLID } from '../../Shared/GLID';
import Address from '../../Shared/Address';

const useInfoPanelStyles = makeStyles(theme => ({
  root: {
  },
  card: {
    position: 'relative'
  },
  cardContent: {
    '&:last-child': { paddingBottom: theme.spacing(2) }
  },
  editIconWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

function InfoPanel({ title, children, onEdit, className, ...props }) {
  const classes = useInfoPanelStyles();

  return (
    <Card
      className={[className, classes.card]}
      variant="outlined"
      {...props}
    >
      <CardContent
        className={classes.cardContent}
      >
        <div
          className={classes.editIconWrapper}
        >
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </div>
        <Typography variant="h5" element="h2" paragraph>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

const useCustomerInfoPanelStyles = makeStyles(theme => ({
  customerInfoPanel: {
    marginBottom: theme.spacing(3)
  }
}));

function CustomerInfoPanel({ id }) {
  const classes = useCustomerInfoPanelStyles();
  const [customer, setCustomer] = React.useState(null);

  React.useEffect(() => {
    API.Customers.get(id).then(customer => setCustomer(customer));
  }, [id]);

  return customer && (
    <div>
      <InfoPanel
        className={classes.customerInfoPanel}
        title="Customer Info"
        onEdit={() => alert('edit the customer!')}
      >
        <Typography>
          {customer.firstName} {customer.lastName}
        </Typography>
        <Typography>
          {customer.email}
        </Typography>
        <Typography>
          {customer.phone}
        </Typography>
      </InfoPanel>
      
      <InfoPanel
        title="Shipping Address"
        onEdit={() => alert('edit the address!')}
      >
        <Address data={customer.address}/>
      </InfoPanel>
    </div>
  );
}

export default function OrderViewer({ orderId }) {
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    API.Orders.get(parseGLID(orderId)).then(order => setOrder(order));
  }, [orderId]);
  
  return order && (
    <div>
      <Grid container>
        <Grid item sm={12} md={5}>
          <CustomerInfoPanel id={order.customerId}/>
        </Grid>
      </Grid>
    </div>
  );
}