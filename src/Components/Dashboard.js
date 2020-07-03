import React from 'react';
import {
  Typography
} from '@material-ui/core';

import Nav from './Nav';

export default function Dashboard({ history }) {
  return (
    <Nav title="Dashboard">
      <Typography>Welcome to the Gerber Labs Management Portal!</Typography>
    </Nav>
  );
};