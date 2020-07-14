import React from 'react';
import API from '../../../Services/API';
import Auth from '../../../Services/Auth';
import ListTable, { tableIcons } from '../../Shared/ListTable';
import GLID, { makeGLID } from '../../Shared/GLID';

export default function UserList({ history }) {
  const [authUser, setAuthUser] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [filteringEnabled, setFilteringEnabled] = React.useState(false);

  React.useEffect(() => {
    API.Users.getAll().then(users => setUsers(users))
  }, []);

  React.useEffect(() => {
    Auth.currentUser.subscribe(data => data ? setAuthUser(data.user) : setAuthUser(null));
  }, []);

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
          tooltip: 'Add User',
          isFreeAction: true,
          onClick: () => history.push('/users/new')
        },
        {
          icon: tableIcons.Edit,
          tooltip: 'Edit User',
          onClick: (event, rowData) => history.push(`/users/${makeGLID(rowData.glid)}`)
        },
        rowData => ({
          icon: tableIcons.Delete,
          tooltip: 'Delete User',
          onClick: (event, rowData) => console.log(authUser),
          disabled: rowData.type === 0 || authUser === null || authUser.role > rowData.type
        })
      ]}
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'User ID', field: 'glid', render: rowData => <GLID id={rowData.glid} /> },
        { title: 'Type', field: 'type', lookup: { 0: 'Super Admin', 1: 'Admin', 2: 'Manufacturer' } },
        { title: 'Email', field: 'email' },
        { title: 'Last Login', field: 'lastLogin', type: 'datetime' },
        { title: 'IP', field: 'ip' }
      ]}
      data={users.map(user => ({
        name: user.name,
        glid: user.glid,
        type: user.role,
        email: user.email,
        lastLogin: user.loggedInOn || '-',
        ip: user.ip || '-'
      }))}
      title="Users"
    />
  );
};