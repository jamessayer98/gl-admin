import React from 'react';
import API from '../../../Services/API';
import ListTable, { tableIcons } from '../../UI/ListTable';
import GLID, { makeGLID, parseGLID } from '../../UI/GLID';
import Auth, { roles } from '../../../Services/Auth';

export default function OrderList({ history, customerId, hideCustomer, readOnly }) {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    let getOrders;

    if (customerId) {
      getOrders = API.Orders.getOrdersByCustomer(parseGLID(customerId));
    } if (Auth.currentUserRole === roles.manufacturer) {
      getOrders = API.Orders.getOrdersByManufacturer(Auth.currentUserGLID);
    } else {
      getOrders = API.Orders.getAll();
    }

    getOrders.then(orderData => {
      setOrders(orderData);
      setLoading(false);
    });
  }, [customerId]);

  let actions = [
    {
      icon: tableIcons.Visibility,
      tooltip: 'View Order',
      onClick: (event, rowData) => history.push(`/orders/${makeGLID(rowData.glid)}`)
    }
  ]
  let columns = [
    { title: 'Ordered On', field: 'date', type: 'datetime', table: 'orders' },
    { title: 'Order ID', field: 'glid', table: 'orders', render: rowData => <GLID id={rowData.glid} /> },
    { title: 'Customer ID', field: 'customer', table: 'customers', render: rowData => <GLID id={rowData.customerId} /> },
    { title: 'Customer', field: 'customer', table: 'customers' },
    { title: 'Email', field: 'email', table: 'customers' },
    { title: 'Board Count', field: 'boardCount', table: 'orders' },
    { title: 'Est. Area', field: 'estArea', table: 'orders' },
    { title: 'Total', field: 'total', type: 'currency', table: 'orders' },
    { title: 'Status', field: 'status', table: 'orders' }
  ]

  return (
    <ListTable
      title="Orders"
      options={readOnly ? { paging: false, search: false, tableLayout: "fixed" } : null}
      actions={readOnly ? null : actions}
      isLoading={loading}
      columns={hideCustomer ? columns.filter(f => f.table !== 'customers') : columns}
      data={orders.map((order, index) => {
        return {
          date: order.createdOn,
          glid: order.glid,
          customerId: order.customer && order.customer.glid,
          customer: order.customer && order.customer.firstName + ' ' + order.customer.lastName,
          email: order.customer && order.customer.email,
          boardCount: order.details.boardCount,
          estArea: order.details.totalBoardArea,
          total: order.amounts.total,
          status: order.status
        }
      })}
      onRowClick={(event, rowData) => history.push(`/orders/${makeGLID(rowData.glid)}`)}
    />
  );
};