import React from 'react';
import {
  Typography
} from '@material-ui/core';
import DefaultLayout from '../../Layout/DefaultLayout';

export default function SettingsPage() {
  const [title] = React.useState('Pricing Table');

  return (
    <DefaultLayout
      title={title}
    >
      <Typography>Settings page</Typography>
    </DefaultLayout>
  );
};