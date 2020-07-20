import React from 'react';
import {
  Grid,
  Typography,
  Card,
  IconButton,
  CardContent,
  makeStyles,
  TableContainer,
  Box,
  Table,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Save as SaveIcon
} from '@material-ui/icons';
import API from '../../../Services/API';
import { parseGLID } from '../../UI/GLID';
import Address from '../../UI/Address';
import Currency from '../../UI/Currency';
import OrderItem from './OrderItem';

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

function InfoPanel({ title, children, editable, onEdit, className, ...props }) {
  const classes = useInfoPanelStyles();

  if (editable === undefined) {
    editable = true;
  }

  return (
    <Card
      className={className + ' ' + classes.card}
      variant="outlined"
      {...props}
    >
      <CardContent
        className={classes.cardContent}
      >
        {editable && (
          <div
            className={classes.editIconWrapper}
          >
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </div>
        )}

        <Typography variant="h5" element="h2" paragraph>{title}</Typography>

        {children}
      </CardContent>
    </Card>
  );
}


function CustomerInfoPanel({ customer }) {
  return (
      <InfoPanel
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
  );
}

function ShippingInfoPanel({ customer }) {
  return (
    <InfoPanel
      title="Shipping Address"
      onEdit={() => alert('edit the address!')}
    >
      <Address data={customer.address} />
    </InfoPanel>
  );
};

function NotesInfoPanel({ notes }) {
  return (
    <InfoPanel
      title="Order Notes"
      onEdit={() => alert('edit the notes!')}
    >
      {notes !== '' && (
        <Typography>
          {notes}
        </Typography>
      )}
      {notes === '' && (
        <Typography color="textSecondary">
          No notes yet
        </Typography>
      )}
    </InfoPanel>
  )
}

const useBillingInfoPanelStyles = makeStyles(theme => ({
  tableContainer: {
    marginBottom: theme.spacing(2)
  },
  refundIcon: {
    fontSize: 12,
    marginLeft: theme.spacing(2)
  }
}));

function BillingInfoPanel({ order, onRefundAmountChange }) {
  const classes = useBillingInfoPanelStyles();
  let refundAmount = null;
  const [refundDisplayType, setRefundDisplayType] = React.useState('text');

  const rows = [
    {
      title: 'Item Total',
      content: <Currency value={order.amounts.itemTotalPrice}/>
    },
    {
      title: 'Coupon',
      content: '--' // TODO Coupon Component
    },
    {
      title: 'Tax',
      content: <Currency value={order.amounts.tax} />
    },
    {
      title: 'Order Total',
      content: <Currency value={order.amounts.total} />
    }
  ];

  function handleRefundEditClick(event) {
    setRefundDisplayType('input');
  }

  function handleRefundSaveClick(event) {
    console.log(event);
    setRefundDisplayType('text');
    onRefundAmountChange(refundAmount);
  }

  return (
    <InfoPanel
      title="Billing"
      editable={false}
    >
      <TableContainer
        component={Box}
        className={classes.tableContainer}
      >
        <Table
          size="small"
        >
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                >
                  {row.title}
                </TableCell>
                <TableCell>
                  {row.content}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography paragraph>
        Refund to date:
        <Currency
          value={order.amounts.refunded}
          displayType={refundDisplayType}
          onValueChange={values => refundAmount = values.floatValue}
          onSubmit={() => alert('submit!')}
        />
        {refundDisplayType === 'text' && (
          <EditIcon
            className={classes.refundIcon}
            onClick={handleRefundEditClick}
          />
        )}
        {refundDisplayType === 'input' && (
          <SaveIcon
            className={classes.refundIcon}
            onClick={handleRefundSaveClick}
          />
        )}
      </Typography>
    </InfoPanel>
  );
}

function LogInfoPanel({ order }) {
  return (
    <InfoPanel
      title="Activity Log"
      editable={false}
    >
      <Typography color="textSecondary">Not implemented yet</Typography>
    </ InfoPanel>
  );
};

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