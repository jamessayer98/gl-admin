import React from 'react';

import DefaultLayout from '../../Layout/DefaultLayout';
import Modal from '../../UI/Modal';
import { CouponList, CouponForm } from '.';

export default function CouponPage({ match, history }) {
  const [title] = React.useState('Coupons');
  const [listKey, setListKey] = React.useState(1);

  const handleCouponDialogComplete = message => {
    setListKey(listKey + 1);
    history.push('/coupons');
  };

  return (
    <DefaultLayout
      title={title}
    >
      <CouponList key={listKey} history={history} />

      {match.params.id && (
        <Modal
          title={`${match.params.id === 'new' ? "New" : ""} Coupon`}
          toRoute="/coupons"
        >
          <CouponForm
            couponId={match.params.id}
            onComplete={handleCouponDialogComplete}
          />
        </Modal>
      )}
    </DefaultLayout>
  );
};