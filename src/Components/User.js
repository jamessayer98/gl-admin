import React from 'react';

import Nav from './Nav';

export default function UserList({ history }) {
  const [title, setTitle] = React.useState('Users');

  return (
    <Nav title={title}>
      <p>Hello Users List</p>
    </Nav>
  );
};