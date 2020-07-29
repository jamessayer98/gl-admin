import React from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import {
  Save as SaveIcon
} from '@material-ui/icons';
import * as formik from 'formik';
import * as yup from 'yup';

import API from '../../../../Services/API';
import { InputField, Switch } from '../../../UI/FormFields';
import { PHONE_REGEX } from '../../../../Services/StaticData';

const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  }
}));

const validationSchema = yup.object().shape({
  street: yup.string().required('Shipping address 1 is required'),
  secondary: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('US state is required'),
  zip: yup.string().required('Zip is required'),
  applyToAccount: yup.boolean()
});

export default function OrderShippingAddressForm({ order, onComplete }) {
  const classes = useStyles();

  return (
    <formik.Formik
      initialValues={{ applyToAcount: false, ...order.customer.address }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        const promises = [];
        const updateAccount = values.applyToAccount;
        delete values.applyToAccount;

        let newCustomerValues = {
          ...order.customer,
          address: {
            ...order.customer.address,
            ...values
          }
        };

        let newOrderValues = {
          ...order,
          customer: newCustomerValues
        };

        promises.push(API.Orders.update(order.glid, newOrderValues));

        if (updateAccount) {
          promises.push(API.Customers.update(order.customer.glid, newCustomerValues));
        }

        Promise.all(promises).then(() => {
          setSubmitting(false);
          onComplete('Order Customer Info Updated', newOrderValues);
        });
      }}
    >
      {({ errors, isSubmitting }) => (
        <formik.Form autoComplete="off">
          <formik.Field
            component={InputField}
            name="street"
            label="Address (line 1)"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="secondary"
            label="Address (line 2)"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="city"
            label="City"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="state"
            label="State"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="zip"
            label="Zip"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={Switch}
            name="applyToAccount"
            label={<span>Also apply these changes to the Customer Account<br />NOTE: This will NOT automatically be applied to other orders.</span>}
            margin="normal"
            inputProps={{ color: 'primary' }}
          />
          <Box className={classes.formActions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              margin="normal"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              Update
            </Button>
          </Box>
        </formik.Form>
      )}
    </formik.Formik>
  );
}