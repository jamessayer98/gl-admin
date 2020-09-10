import React from 'react';
import { Typography } from '@material-ui/core';
import DefaultLayout from '../../Layout/DefaultLayout';

import PricingTable from './PricingTable';
import Tabs, { Tab } from '../../UI/Tabs';


export default function ProductPage() {
  const [title] = React.useState('Product Configuration');

  return (
    <DefaultLayout
      title={title}
    >
      <Tabs
        id="product-config"
      >
        <Tab
          key={0}
          id="pricing"
          label="Pricing"
          style={{ padding: 0 }}
        >
          <PricingTable />
        </Tab>
        <Tab
          key={1}
          id="upsells"
          label="Upsells"
        >
          <Typography>upsells</Typography>
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
}