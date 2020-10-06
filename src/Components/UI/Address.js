import React from 'react';
import { Typography } from '@material-ui/core';

export function AddressLine({ data }) {
  return (  
    <span>
      {data.street} {data.secondary} {data.city}, {data.state} {data.zip}, {data.country}
    </span>
  );
}

export default function Address({ data }) {
  return (
    <div>
      <Typography>{data.street}</Typography>
      {data.secondary && <Typography>{data.secondary}</Typography>}
      <Typography>{data.city}, {data.state} {data.zip}</Typography>
      <Typography>{data.country}</Typography>
    </div>
  );
}