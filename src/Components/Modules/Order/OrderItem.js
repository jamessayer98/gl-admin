import React from 'react';
import { Grid, Typography, Table, TableRow, TableBody, TableCell, makeStyles, TableFooter, Divider, Button, Box, TextField, FormControlLabel, InputAdornment, IconButton, Switch } from '@material-ui/core';
import { FindInPage as FindInPageIcon, GetApp as GetAppIcon, LocalShipping as LocalShippingIcon, Save as SaveIcon, FileCopy as FileCopyIcon, Edit as EditIcon } from '@material-ui/icons';
import { makeGLID } from '../../UI/GLID';
import Currency from '../../UI/Currency';
import Modal from '../../UI/Modal';
import GerberPreview from './GerberPreview';
import API from '../../../Services/API';
import NumberFormat from 'react-number-format';
import Auth, { roles } from '../../../Services/Auth';

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

  if (Auth.currentUserRole === roles.manufacturer) {
    boardData.push({ label: 'Layers', value: item.board.metrics.layers });
  }

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
      <TableCell>{lineItem.type || ''}</TableCell>
      <TableCell align="right">{ lineItem && <Currency value={lineItem.total}/>}</TableCell>
    </TableRow>
  );
}

function OrderItemTrackingNumber({ order, item, onUpdated }) {
  const [trackingNumber, setTrackingNumber] = React.useState(item.tracking || ''); // Default to empty string
  const [enabled, setEnabled] = React.useState(trackingNumber === ''); // Only enable when there is NOT a tracking number already present
  const ref = React.useRef();

  let commonProps = {
    variant: 'outlined',
    label: 'Tracking Number',
    value: trackingNumber,
    fullWidth: true,
    inputRef: ref,
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
                let newOrderItems = [...order.items];
                newOrderItems.map(_item => {
                  if (item.ordinal === _item.ordinal) {
                    item.tracking = trackingNumber;
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
              <div>
                <IconButton onClick={e => {
                  ref.current.disabled = false;
                  ref.current.select();
                  document.execCommand('copy');
                  document.getSelection().empty();
                  ref.current.disabled = true;
                }}>
                  <FileCopyIcon />
                </IconButton>
                <IconButton onClick={e => {
                  setEnabled(true);
                }}>
                  <EditIcon />
                </IconButton>
              </div>
            </InputAdornment>
          )
        }}
      />
    );
  }
}

function OrderLineItemUpsell({ upsell }) {
  if (upsell) {
    if (upsell.type === 'percent') {
      return <span>{Number(upsell.amount)}%</span>
    } else if (upsell.type === 'flat') {
      return <span>${Number(upsell.amount).toFixed(2)}</span>
    }
  }

  return <span>&mdash;</span>;
}

export function OrderItemLineItems({ item, upsells, ...props }) {
  const classes = useStyles();

  const lineItems = () => {
    if (Auth.currentUserRole === roles.manufacturer) {
      return lineItemsMfg();
    } else {
      return lineItemsAdmin();
    }
  }

  const lineItemsAdmin = () => {
    return (      
      <>
        <OrderItemLineItem key="area" lineItem={{
          label: 'Est. Board Area',
          value: <span><NumberFormat value={item.board.metrics.area} displayType="text" decimalScale={2} fixedDecimalScale={true} /> mm<sup>2</sup></span>,
          secondaryLabel: 'Layers',
          secondaryValue: item.board.metrics.layers,
          type: 'Base Price',
          total: item.amounts.base
        }} />
        <OrderItemLineItem key="copperWeight" lineItem={{
          label: 'Copper Weight',
          value: `${item.options.copperWeight} oz`,
          secondaryLabel: 'Multiplier',
          secondaryValue: <OrderLineItemUpsell upsell={upsells.find(u => u.option === 'copperWeight' && u.value === item.options.copperWeight)} />,
          type: 'Upsell',
          total: item.amounts.options.copperWeight
        }} />
        <OrderItemLineItem key="surfaceFinish" lineItem={{
          label: 'Surface Finish',
          value: item.options.surfaceFinish,
          secondaryLabel: 'Multiplier',
          secondaryValue: <OrderLineItemUpsell upsell={upsells.find(u => u.option === 'surfaceFinish' && u.value === item.options.surfaceFinish)} />,
          type: 'Upsell',
          total: item.amounts.options.surfaceFinish
        }} />
        <OrderItemLineItem key="tg" lineItem={{
          label: 'Tg',
          value: <span>{item.options.tg} &deg;C</span>,
          secondaryLabel: 'Multiplier',
          secondaryValue: <OrderLineItemUpsell upsell={upsells.find(u => u.option === 'tg' && u.value === item.options.tg)} />,
          type: 'Upsell',
          total: item.amounts.options.tg
        }} />
      </>
    );
  };

  const lineItemsMfg = () => {
    return (  
      <>
        <OrderItemLineItem key="area" lineItem={{
          label: 'Est. Board Area',
          value: <span><NumberFormat value={item.board.metrics.area} displayType="text" decimalScale={2} fixedDecimalScale={true} /> mm<sup>2</sup></span>
        }} />
        <OrderItemLineItem key="copperWeight" lineItem={{
          label: 'Copper Weight',
          value: `${item.options.copperWeight} oz`,
        }} />
        <OrderItemLineItem key="surfaceFinish" lineItem={{
          label: 'Surface Finish',
          value: item.options.surfaceFinish,
        }} />
        <OrderItemLineItem key="tg" lineItem={{
          label: 'Tg',
          value: <span>{item.options.tg} &deg;C</span>,
        }} />
      </>
    );
  }

  return upsells && (
    <Table
      size="small"
      className={classes.stripedTable}
      {...props}
    >
      <TableBody>
        {lineItems()}
      </TableBody>
      {Auth.currentUserRole !== roles.manufacturer && (
        <TableFooter>
          <TableRow key="tax">
            <TableCell colSpan={4}></TableCell>
            <TableCell> 
              Tax
            </TableCell>
            <TableCell align="right">
              <Currency value={item.amounts.tax} />
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
              <Currency value={item.amounts.total} />
            </TableCell>
          </TableRow>
        </TableFooter>      
      )}
    </Table>
  );
};

export default function OrderItem({ order, item, upsells }) {
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
        <OrderItemLineItems item={itemState} upsells={upsells} />
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
                  color="secondary"
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
                        tracking: ''
                      });
                    });
                  }}
                />
              )}
              label="Tracking Not Available"
              disabled={itemState.tracking && itemState.tracking !== ''}
            />
          </Typography>

          <Typography>
            <Button
              fullWidth
              variant={item.shipped ? 'outlined' : 'contained'}
              disabled={item.shipped}
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
              {!item.shipped && <span>Mark As Shipped</span>}
              {item.shipped && <span>Item shipped</span>}
            </Button>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};