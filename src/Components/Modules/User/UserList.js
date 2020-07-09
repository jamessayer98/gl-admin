import React from 'react';
import API from '../../../Services/API';
import ListTable, { tableIcons } from '../../Shared/ListTable';

export default function UserList({ history }) {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    API.Users.getAll().then(users => setUsers(users))
  }, []);

  return (
    <ListTable
      options={{
        filtering: true
      }}
      actions={[
        {
          icon: tableIcons.Add,
          tooltip: 'Add User',
          isFreeAction: true,
          onClick: () => history.push('/users/new')
        },
        {
          icon: tableIcons.Edit,
          tooltip: 'Edit User',
          onClick: (event, rowData) => history.push(`/users/${rowData.id}`)
        },
        rowData => ({
          icon: tableIcons.Delete,
          tooltip: 'Delete User',
          onClick: (event, rowData) => alert('Not implemented. Yes, this is a soft-delete. No you cannot delete SuperAdmins lolol.'),
          disabled: rowData.type === 0
        })
      ]}
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'User ID', field: 'id' },
        { title: 'Type', field: 'type', lookup: { 0: 'Super Admin', 1: 'Admin', 2: 'Manufacturer' } },
        { title: 'Email', field: 'email' },
        { title: 'Last Login', field: 'lastLogin', type: 'datetime' },
        { title: 'IP', field: 'ip' }
      ]}
      data={users.map(user => ({
        name: user.name,
        id: user._id,
        type: user.role,
        email: user.email,
        lastLogin: user.loggedInOn || '-',
        ip: user.ip || '-'
      }))}
      title="Users"
    />
  );
};