import React from 'react';
import { Typography, makeStyles, TableContainer, Table, TableRow, TableCell, TableBody, Box } from '@material-ui/core';
import { Edit as EditIcon, Save as SaveIcon } from '@material-ui/icons';
import InfoPanel from '../../UI/InfoPanel';
import Address from '../../UI/Address';
import Currency from '../../UI/Currency';

export function CustomerInfoPanel({ customer }) {
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

export function ShippingInfoPanel({ customer }) {
  return (
    <InfoPanel
      title="Shipping Address"
      onEdit={() => alert('edit the address!')}
    >
      <Address data={customer.address} />
    </InfoPanel>
  );
};

export function NotesInfoPanel({ notes }) {
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

export function BillingInfoPanel({ order, onRefundAmountChange }) {
  const classes = useBillingInfoPanelStyles();
  let refundAmount = null;
  const [refundDisplayType, setRefundDisplayType] = React.useState('text');

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