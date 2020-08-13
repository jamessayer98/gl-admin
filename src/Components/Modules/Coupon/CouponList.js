import React from 'react';
import { Check as CheckIcon, Close as CloseIcon } from '@material-ui/icons';
import API from '../../../Services/API';
import ListTable, { tableIcons } from '../../UI/ListTable';
import { makeGLID } from '../../UI/GLID';
import Currency from '../../UI/Currency';
import { Chip } from '@material-ui/core';

export default function CouponList({ history }) {
  const [coupons, setCoupons] = React.useState([]);
  const [filteringEnabled, setFilteringEnabled] = React.useState(false);

  React.useEffect(() => {
    API.Coupons.getAll().then(coupons => setCoupons(coupons))
  }, []);

  const renderDiscountColumn = rowData => {
    if (rowData.type === 'percent') {
      return <span>{rowData.discount}%</span>;
    } else if (rowData.type === 'flat') {
      return <Currency value={rowData.discount} />;
    } else {
      return <span>{rowData.discount}</span>;
    }
  };

  const renderStatusColumn = rowData => {
    if (rowData.status === 'enabled') {
      return <Chip color="primary" icon={<CheckIcon />} label="Enabled" />;
    } else if (rowData.status === 'disabled') {
      return <Chip color="secondary" icon={<CloseIcon />} label="Disabled" />;
    } else {
      return <Chip label={rowData.status} />;
    }
  };

  return (
    <ListTable
      options={{
        filtering: filteringEnabled
      }}
      actions={[
        {
          icon: tableIcons.Filter,
          tooltip: 'Toggle Filtering',
          isFreeAction: true,
          onClick: () => setFilteringEnabled(!filteringEnabled)
        },
        {
          icon: tableIcons.Add,
          tooltip: 'Add Coupon',
          isFreeAction: true,
          onClick: () => history.push('/coupons/new')
        },
        {
          icon: tableIcons.Edit,
          tooltip: 'Edit Coupon',
          onClick: (event, rowData) => history.push(`/coupons/${makeGLID(rowData.glid)}`)
        },
        rowData => ({
          icon: tableIcons.Delete,
          tooltip: 'Delete Coupon',
          onClick: (event, rowData) => alert('Not implemented. Yes, this is a soft-delete. No you cannot delete SuperAdmins lolol.'),
          disabled: rowData.type === 0
        })
      ]}
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'Code', field: 'code' },
        { title: 'Type', field: 'type' },
        { title: 'Discount', field: 'discount', render: renderDiscountColumn },
        { title: '# Uses', field: 'usage' },
        { title: 'Status', field: 'status', render: renderStatusColumn },
        { title: 'Created On', field: 'createdOn', type: 'datetime' }
      ]}
      data={coupons.map(coupon => ({
        glid: coupon.glid,
        name: coupon.name,
        code: coupon.code,
        type: coupon.type === 'percent' ? 'Percent' : 'Flat Rate',
        discount: coupon.value,
        usage: coupon.uses,
        status: coupon.status,
        createdOn: coupon.createdOn
      }))}
      title="Coupons"
      onRowClick={(event, rowData) => history.push(`/coupons/${makeGLID(rowData.glid)}`)}
    />
  );
};