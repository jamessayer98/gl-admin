import React from 'react';
import { titleCase } from 'title-case';
import API from '../../../Services/API';
import ListTable, { tableIcons } from '../../UI/ListTable';
import GLID, { makeGLID, parseGLID } from '../../UI/GLID';
import Auth, { roles } from '../../../Services/Auth';
import { AddressLine } from '../../UI/Address';

export default function OrderList({ history, customerId, hideCustomer, readOnly }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    let getOrders;

    if (customerId) {
      getOrders = API.Orders.getOrdersByCustomer(parseGLID(customerId));
    } if (Auth.currentUserRole === roles.manufacturer) {
      getOrders = API.Orders.getOrdersByManufacturer(Auth.currentUserValue.user.manufacturer);
    } else {
      getOrders = API.Orders.getAll();
    }

    getOrders.then(orderData => {
      setOrders(orderData.filter(o => o.status !== 'in_progress'));
      setLoading(false);
    });
  }, [customerId]);

  let actions = [
    {
      icon: tableIcons.Visibility,
      tooltip: 'View Order',
      onClick: (event, rowData) => history.push(`/orders/${makeGLID(rowData.glid)}`)
    }
  ];

  let columns = null;

  if (Auth.currentUserRole !== roles.manufacturer) {
    columns = [
      { title: 'Ordered On', field: 'date', type: 'datetime', table: 'orders', defaultSort: 'desc' },
      { title: 'Order ID', field: 'glid', table: 'orders', render: rowData => <GLID id={rowData.glid} /> },
      { title: 'Customer ID', field: 'customerId', table: 'customers' },
      { title: 'Customer', field: 'customer', table: 'customers' },
      { title: 'Email', field: 'email', table: 'customers' },
      { title: 'Board Count', field: 'boardCount', table: 'orders' },
      { title: 'Est. Area', field: 'estArea', table: 'orders' },
      { title: 'Total', field: 'total', type: 'currency', table: 'orders' },
      { title: 'Status', field: 'status', table: 'orders' }
    ];
  } else {
    columns = [
      { title: 'Received', field: 'date', type: 'datetime', table: 'orders' },
      { title: 'Order ID', field: 'glid', table: 'orders', render: rowData => <GLID id={rowData.glid} /> },
      { title: 'Customer', field: 'customer', table: 'customers' },
      { title: 'Address', field: 'address', table: 'customers' },
      { title: 'Total Items', field: 'boardCount', table: 'orders' },
      { title: 'Items Shipped', field: 'itemsShipped', table: 'orders' },
      { title: 'Items Unshipped', field: 'itemsUnshipped', table: 'orders' },
      { title: 'Status', field: 'status', table: 'orders' }
    ];
  }

  return orders && (
    <ListTable
      title="Orders"
      options={readOnly ? { paging: false, search: false, tableLayout: "fixed" } : null}
      actions={readOnly ? null : actions}
      isLoading={loading}
      columns={hideCustomer ? columns.filter(f => f.table !== 'customers') : columns}
      data={orders.map((order, index) => {
        let data = {
          date: order.createdOn,
          glid: order.glid,
          boardCount: order.items.length,
          status: titleCase(String(order.status).replace('_', ' '))
        };

        if (order.customer) {          
          data.customer = order.customer.firstName + ' ' + order.customer.lastName;
        } else {
          data.customer = 'Guest';
        }

        if (Auth.currentUserRole !== roles.manufacturer) {
          data.email = order.customer && order.customer.email;
          data.estArea =Number(order.metrics.estArea / 1e6).toFixed(2);

          if (order.customerId) {
            data.customerId = <GLID id={order.customerId} />;
          } else {
            data.customerId = <span>&mdash;</span>;
          }  

          if (order.amounts) {
            data.total = order.amounts.total;
          } else {
            data.total = 0.00;
          }      
        } else {
          // { title: 'Address', field: 'address', table: 'customers' },
          // { title: 'Items Shipped', field: 'itemsShipped', table: 'orders' },
          // { title: 'Items Unshipped', field: 'itemsUnshipped', table: 'orders' },
          data.date = order.sentToManufacturerOn;
          data.address = <AddressLine data={order.customer.address} />
          data.itemsShipped = order.items.filter(item => item.shipped).length;
          data.itemsUnshipped = order.items.length - data.itemsShipped;
        }

        return data;
      })}
      onRowClick={(event, rowData) => history.push(`/orders/${makeGLID(rowData.glid)}`)}
    />
  );
};