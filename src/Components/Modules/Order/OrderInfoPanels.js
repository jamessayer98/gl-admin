import React from 'react';
import { Typography, makeStyles, TableContainer, Table, TableRow, TableCell, TableBody, Box } from '@material-ui/core';
import InfoPanel from '../../UI/InfoPanel';
import Address from '../../UI/Address';
import Currency from '../../UI/Currency';
import Modal from '../../UI/Modal';
import { OrderCustomerInfoForm, OrderShippingAddressForm, OrderNotesForm } from './Forms';
import EditableText from '../../UI/EditableText';
import API from '../../../Services/API';

export function CustomerInfoPanel({ order }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [orderState, setOrderState] = React.useState(order);

  return (
    <InfoPanel
      title="Customer Info"
      onEdit={() => setDialogOpen(true)}
    >
      <Typography>
        {orderState.customer.firstName} {orderState.customer.lastName}
      </Typography>
      <Typography>
        {orderState.customer.email}
      </Typography>
      <Typography>
        {orderState.customer.phone}
      </Typography>

      {dialogOpen && <Modal
        title="Edit Order Customer Info"
        onClose={() => setDialogOpen(false)}
      >
        <OrderCustomerInfoForm
          order={orderState}
          onComplete={(message, order) => {
            setOrderState(order);
            setDialogOpen(false);
          }}
        />
      </Modal>}
    </InfoPanel>
  );
}

export function ShippingInfoPanel({ order }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [orderState, setOrderState] = React.useState(order);

  return (
    <InfoPanel
      title="Shipping Address"
      onEdit={() => setDialogOpen(true)}
    >
      <Address data={orderState.customer.address} />

      {dialogOpen && <Modal
        title="Edit Order Customer Info"
        onClose={() => setDialogOpen(false)}
      >
        <OrderShippingAddressForm
          order={orderState}
          onComplete={(message, order) => {
            setOrderState(order);
            setDialogOpen(false);
          }}
        />
      </Modal>}
    </InfoPanel>
  );
};

export function NotesInfoPanel({ order }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [orderState, setOrderState] = React.useState(order);
  
  return (
    <InfoPanel
      title="Order Notes"
      onEdit={() => {
        setDialogOpen(true);
      }}
    >
      {orderState.notes !== '' && (
        <Typography>
          {orderState.notes}
        </Typography>
      )}
      {orderState.notes === '' && (
        <Typography color="textSecondary">
          No notes yet
        </Typography>
      )}
      
      {dialogOpen && <Modal
        title="Edit Order Customer Info"
        onClose={() => setDialogOpen(false)}
      >
        <OrderNotesForm
          order={orderState}
          onComplete={(message, order) => {
            setOrderState(order);
            setDialogOpen(false);
          }}
        />
      </Modal>}
    </InfoPanel>
  )
}

const useBillingInfoPanelStyles = makeStyles(theme => ({
  tableContainer: {
    marginBottom: theme.spacing(2)
  }
}));

export function BillingInfoPanel({ order, onRefundAmountChange }) {
  const classes = useBillingInfoPanelStyles();

  const rows = [
    {
      title: 'Item Total',
      content: <Currency value={order.amounts.itemTotalPrice} />
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
        <EditableText
          label="Refund to date:"
          value={Number(order.amounts.refunded).toFixed(2)}
          valuePrefix="$"
          onSave={value => {
            let newAmounts = { ...order.amounts, refunded: value };
            //TODO: Notify user
            API.Orders.update(order.glid, { ...order, amounts: newAmounts });
          }}
        />
      </Typography>
    </InfoPanel>
  );
}

export function LogInfoPanel({ order }) {
  return (
    <InfoPanel
      title="Activity Log"
      editable={false}
    >
      <Typography color="textSecondary">Not implemented yet</Typography>
    </ InfoPanel>
  );
};