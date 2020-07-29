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
  firstName: yup.string()
    .required('First name is required'),
  lastName: yup.string()
    .required('Last name is required'),
  email: yup.string().email()
    .required('A valid email address is required'),
  phone: yup.string()
    .required('A valid phone number is required')
    .matches(PHONE_REGEX, 'Phone number is not valid'),
  applyToAccount: yup.boolean()
});

export default function OrderCustomerInfoForm({ order, onComplete }) {
  const classes = useStyles();

  return (
    <formik.Formik
      initialValues={{
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
        applyToAccount: false
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        const promises = [];
        const updateAccount = values.applyToAccount;
        delete values.applyToAccount;

        let newCustomerValues = {
          ...order.customer,
          ...values
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
            name="firstName"
            label="First Name"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="lastName"
            label="Last Name"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="email"
            label="Email"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="phone"
            label="Phone"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={Switch}
            name="applyToAccount"
            label={<span>Also apply these changes to the Customer Account<br/>NOTE: This will NOT automatically be applied to other orders.</span>}
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