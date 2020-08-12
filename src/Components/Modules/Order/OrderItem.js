import React from 'react';
import { Grid, Typography, Table, TableRow, TableBody, TableCell, makeStyles, TableFooter, Divider, Button, Box, TextField, FormControlLabel, InputAdornment, IconButton, Switch } from '@material-ui/core';
import { FindInPage as FindInPageIcon, GetApp as GetAppIcon, LocalShipping as LocalShippingIcon, Save as SaveIcon, FileCopy as FileCopyIcon } from '@material-ui/icons';
import { makeGLID } from '../../UI/GLID';
import Currency from '../../UI/Currency';
import Modal from '../../UI/Modal';
import GerberPreview from './GerberPreview';
import API from '../../../Services/API';
import NumberFormat from 'react-number-format';

const useStyles = makeStyles(theme => ({
  table: {
    '& tbody th': {
      fontWeight: theme.typography.fontWeightBold
    }
  },
  stripedTable: {
    '& tbody th': {
      fontWeight: theme.typography.fontWeightBold
    },
    '& th, & td': {
      borderBottom: 'none'
    },
    '& tbody tr:nth-child(odd)': {
      backgroundColor: theme.palette.grey[200]
    },
    '& tfoot th, & tfoot td': {
      fontSize: theme.typography.body1.fontSize,
      color: theme.palette.text.primary,
    }
  },
  basicInfoTable: {
    marginBottom: theme.spacing(2)
  },
  actionsBox: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  dividerMiddle: {
    margin: theme.spacing(2, 0)
  }
}));

export function OrderItemBasicInfoTable({ order, item, ...props }) {
  const classes = useStyles();
  const boardData = [
    { label: 'Max board length', value: String(item.board.metrics.height) + ' mm' },
    { label: 'Max board width', value: String(item.board.metrics.width) + ' mm' },
    { label: 'Max hole size', value: String(item.board.metrics.maxHoleSize) + ' mm' },
    { label: 'Min hole size', value: String(item.board.metrics.minHoleSize) + ' mm' }
  ];

  return (
    <div {...props}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <Table
            size="small"
            className={classes.table}
          >
            <TableBody>
              <TableRow key="item_id">
                <TableCell
                  component="th"
                  scope="row"
                >
                  Item ID
                </TableCell>
                <TableCell>
                  {makeGLID(order.glid) + '-' + String(item.ordinal).padStart(3, '0')}
                </TableCell>
              </TableRow>
              <TableRow key="item_name">
                <TableCell
                  component="th"
                  scope="row"
                >
                  Name
                </TableCell>
                <TableCell>
                  {item.name}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>        
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        ><Table
          size="small"
          className={classes.table}
        >
            <TableBody>
              {boardData.map((row, index) => (
                <TableRow key={`boardData_${index}`}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {row.label}
                  </TableCell>
                  <TableCell>
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  );
};

function OrderItemLineItem({ lineItem }) {
  return (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
      >
        {lineItem.label}
      </TableCell>
      <TableCell>{lineItem.value}</TableCell>
      <TableCell>{lineItem.secondaryLabel || ''}</TableCell>
      <TableCell>{lineItem.secondaryValue || ''}</TableCell>
      <TableCell>{lineItem.type}</TableCell>
      <TableCell align="right"><Currency value={lineItem.total}/></TableCell>
    </TableRow>
  );
}

function OrderItemTrackingNumber({ order, item, onUpdated }) {
  const [trackingNumber, setTrackingNumber] = React.useState(item.trackingNumber || ''); // Default to empty string
  const [enabled, setEnabled] = React.useState(trackingNumber === ''); // Only enable when there is NOT a tracking number already present

  let commonProps = {
    variant: 'outlined',
    label: 'Tracking Number',
    value: trackingNumber,
    fullWidth: true,
    onChange: e => setTrackingNumber(e.target.value)
  };

  if (enabled) {
    return (
      <TextField
        {...commonProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={e => {
                let newOrderItems = order.items;
                newOrderItems.map(_item => {
                  if (item.ordinal === _item.ordinal) {
                    item.trackingNumber = trackingNumber;
                  }
                  return item;
                });
                let newOrderValues = { ...order, items: newOrderItems };
                API.Orders.update(order.glid, newOrderValues).then(() => {
                  setEnabled(false);
                  onUpdated(trackingNumber);
                });
              }}>
                <SaveIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    );
  } else {
    return (
      <TextField
        {...commonProps}
        disabled
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={e => {
                e.target.select();
                document.execCommand('copy');
              }}>
                <FileCopyIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    );

  }
}

export function OrderItemLineItems({ item, ...props }) {
  const classes = useStyles();
  return (
    <Table
      size="small"
      className={classes.stripedTable}
      {...props}
    >
      <TableBody>
        <OrderItemLineItem key="area" lineItem={{
          label: 'Est. Board Area',
          value: <span><NumberFormat value={item.board.metrics.area} displayType="text" decimalScale={2} fixedDecimalScale={true} /> mm<sup>2</sup></span>,
          secondaryLabel: 'Layers',
          secondaryValue: item.board.layers.count,
          type: 'Base Price',
          total: item.total
        }} />
        <OrderItemLineItem key="copperWeight" lineItem={{
          label: 'Copper Weight',
          value: `${item.options.copperWeight} oz`,
          secondaryLabel: 'Multiplier',
          secondaryValue: '[TODO]',
          type: 'Upsell',
          total: '[TODO]'
        }} />
        <OrderItemLineItem key="surfaceFinish" lineItem={{
          label: 'Surface Finish',
          value: item.options.surfaceFinish,
          secondaryLabel: 'Multiplier',
          secondaryValue: '[TODO]',
          type: 'Upsell',
          total: '[TODO]'
        }} />
        <OrderItemLineItem key="tg" lineItem={{
          label: 'Tg',
          value: <span>{item.options.tg} &deg;C</span>,
          secondaryLabel: 'Multiplier',
          secondaryValue: '[TODO]',
          type: 'Upsell',
          total: '[TODO]'
        }} />
      </TableBody>
      <TableFooter>
        <TableRow key="tax">
          <TableCell colSpan={4}></TableCell>
          <TableCell>
            Tax
          </TableCell>
          <TableCell align="right">
            <Currency value={item.tax} />
          </TableCell>
        </TableRow>
        <TableRow key="total">
          <TableCell colSpan={4}></TableCell>
          <TableCell
            component="th"
            scope="row"
          >
            Total
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align="right"
          >
            <Currency value={item.total} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default function OrderItem({ order, item }) {
  const classes = useStyles();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [itemState, setItemState] = React.useState(item);

  return (
    <Grid
      container
    >
      <Grid
        item
        xs={12}
        md={9}
      >
        <OrderItemBasicInfoTable className={classes.basicInfoTable} order={order} item={itemState} />
        <Divider/>
        <OrderItemLineItems item={itemState} />
      </Grid>

      <Grid
        item
        xs={12}
        md={3}
      >
        <Box
          className={classes.actionsBox}
        >
          <Typography paragraph>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<FindInPageIcon />}
              onClick={() => setPreviewOpen(true)}
            >
              Preview Gerber File
          </Button>
          </Typography>

          {previewOpen && (
            <Modal
              title="Preview Gerber File"
              onClose={() => setPreviewOpen(false)}
            >
              <GerberPreview board={itemState.board} />
            </Modal>
          )}

          <Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GetAppIcon />}
              href={itemState.board.originalUpload}
            >
              Download Gerber File
            </Button>
          </Typography>

          <Divider className={classes.dividerMiddle} variant="middle"/>
          
          {itemState.trackingAvailable && (
            <OrderItemTrackingNumber order={order} item={itemState} onUpdated={trackingNumber => {
              setItemState({
                ...itemState,
                trackingNumber: trackingNumber
              });
            }}/>
          )}

          <Typography paragraph>
            <FormControlLabel
              control={(
                <Switch
                  color="primary"
                  checked={!itemState.trackingAvailable}
                  disabled={itemState.trackingNumber !== ''}
                  onChange={e => {
                    let trackingAvailable = !e.target.checked;
                    let newOrderItems = order.items;
                    newOrderItems.map(_item => {
                      if (itemState.ordinal === _item.ordinal) {
                        _item.trackingAvailable = trackingAvailable;
                      }
                      return _item;
                    });
                    let newOrderValues = { ...order, items: newOrderItems };

                    //TODO: Notify user
                    API.Orders.update(order.glid, newOrderValues).then(() => {
                      setItemState({
                        ...itemState,
                        trackingAvailable: trackingAvailable,
                        trackingNumber: ''
                      });
                    });
                  }}
                />
              )}
              label="Tracking Not Available"
              disabled={item.trackingNumber && item.trackingNumber !== ''}
            />
          </Typography>

          {!item.shipped && <Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<LocalShippingIcon />}
              onClick={() => {
                let newOrderItems = order.items;
                newOrderItems.map(_item => {
                  if (itemState.ordinal === _item.ordinal) {
                    _item.shipped = true;
                  }
                  return _item;
                });
                let newOrderValues = { ...order, items: newOrderItems };

                //TODO: Notify user
                API.Orders.update(order.glid, newOrderValues).then(() => {
                  setItemState({
                    ...itemState,
                    shipped: true
                  });
                });
              }}
            >
              Mark As Shipped
            </Button>
          </Typography>}

          {item.shipped && <Typography paragraph>Item shipped!</Typography>}
        </Box>
      </Grid>
    </Grid>
  );
};