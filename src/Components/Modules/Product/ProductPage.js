import React from 'react';
import DefaultLayout from '../../Layout/DefaultLayout';

import PricingTable from './PricingTable';
import Tabs, { Tab } from '../../UI/Tabs';
import Upsells from './Upsells';


export default function ProductPage() {
  const [title] = React.useState('Product Configuration');

  return (
    <DefaultLayout
      title={title}
      pageTitle="Product"
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
          <Upsells />
        </Tab>
      </Tabs>
    </DefaultLayout>
  );
}