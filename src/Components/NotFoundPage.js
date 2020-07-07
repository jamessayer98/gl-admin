import React from 'react';
import { Typography } from '@material-ui/core';
import DefaultLayout from './Layout/DefaultLayout';

export default function NotFoundPage() {
  return (
    <DefaultLayout title="Page Not Found">
      <Typography>Sorry, but the page you were looking for could not be found</Typography>
    </DefaultLayout>
  );
};