import React from 'react';
import {
  Typography
} from '@material-ui/core';

import { DefaultLayout } from './Layout';

export default function Dashboard({ history }) {
  return (
    <DefaultLayout title="Dashboard">
      <Typography>Welcome to the Gerber Labs Management Portal!</Typography>
    </DefaultLayout>
  );
};