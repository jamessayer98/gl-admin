import React from 'react';
import API from '../../../Services/API';
import ListTable, { tableIcons } from '../../UI/ListTable';
import GLID, { makeGLID, parseGLID } from '../../UI/GLID';

export default function OrderList({ history, customerId, hideCustomer, hideActions }) {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    if (customerId) {
      API.Orders.getOrdersByCustomer(parseGLID(customerId))
      .then(orderData => setOrders(orderData));
    }
    else {
      API.Orders.getAllWithCustomers()
      .then(orderData => setOrders(orderData));
    }    
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
    { title: 'Customer', field: 'customer', table: 'customers' },
    { title: 'Email', field: 'email', table: 'customers' },
    { title: 'Board Count', field: 'boardCount', table: 'orders' },
    { title: 'Est. Area', field: 'estArea', table: 'orders' },
    { title: 'Total', field: 'total', type: 'currency', table: 'orders' },
    { title: 'Status', field: 'status', table: 'orders' }
  ]

  return (
    <ListTable
      actions={hideActions ? null : actions}
      columns={hideCustomer ? columns.filter(f => f.table !== 'customers') : columns}
      data={orders.map((order, index) => {
        return {
          date: order.createdOn,
          glid: order.glid,
          customer: order.customer.firstName + ' ' + order.customer.lastName,
          email: order.customer.email,
          boardCount: order.details.boardCount,
          estArea: order.details.totalBoardArea,
          total: order.amounts.total,
          status: order.status
        }
      })}
      title="Orders"
    />
  );
};