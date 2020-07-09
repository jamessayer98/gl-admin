import React from 'react';
import API from '../../../Services/API';
import ListTable from '../../Shared/ListTable';

export default function OrderList() {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    API.Orders.getAllWithCustomers()
      .then(orderData => setOrders(orderData));
  }, []);

  return (
    <ListTable
      columns={[
        { title: 'Ordered On', field: 'date', type: 'datetime' },
        { title: 'Order ID', field: 'orderId' },
        { title: 'Customer', field: 'customer' },
        { title: 'Email', field: 'email' },
        { title: 'Board Count', field: 'boardCount' },
        { title: 'Est. Area', field: 'estArea' },
        { title: 'Total', field: 'total', type: 'currency' },
        { title: 'Status', field: 'status' }
      ]}
      data={orders.map((order, index) => {
        return {
          date: order.createdOn,
          orderId: order._id,
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