import React from 'react';
import { Grid, Typography, Table, TableRow, TableBody, TableCell, makeStyles, TableFooter, Divider, Button, Box, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { FindInPage as FindInPageIcon, GetApp as GetAppIcon, LocalShipping as LocalShippingIcon } from '@material-ui/icons';
import { makeGLID } from '../../UI/GLID';
import Currency from '../../UI/Currency';

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
    { label: 'Max board length', value: item.board.maxLength },
    { label: 'Max board width', value: item.board.maxWidth },
    { label: 'Max hole size', value: String(item.board.maxHoleSize) + 'mm' },
    { label: 'Min hole size', value: String(item.board.minHoleSize) + 'mm' }
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

export function OrderItemLineItems({ item, ...props }) {
  const classes = useStyles();
  return (
    <Table
      size="small"
      className={classes.stripedTable}
    >
      <TableBody>
        {item.lineItems.map((lineItem, index) => <OrderItemLineItem key={index} lineItem={lineItem} />)}
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

  return (
    <Grid
      container
    >
      <Grid
        item
        xs={12}
        md={9}
      >
        <OrderItemBasicInfoTable className={classes.basicInfoTable} order={order} item={item} />
        <Divider/>
        <OrderItemLineItems item={item} />
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
            >
              Preview Gerber File
          </Button>
          </Typography>

          <Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GetAppIcon />}
            >
              Download Gerber File
            </Button>
          </Typography>

          <Divider className={classes.dividerMiddle} variant="middle"/>
          
          <Typography>
            <TextField
              variant="outlined"
              label="Tracking Number"
              fullWidth
            />
          </Typography>

          <Typography paragraph>
            <FormControlLabel control={<Checkbox />} label="Tracking Not Available" />
          </Typography>

          <Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<LocalShippingIcon />}
            >
              Mark As Shipped
            </Button>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};