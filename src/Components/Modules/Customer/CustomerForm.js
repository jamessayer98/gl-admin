import React from 'react';
import {
  Box, Button, CircularProgress,
  makeStyles
} from '@material-ui/core';
import {
  Save as SaveIcon
} from '@material-ui/icons';
import * as formik from 'formik';
import * as yup from 'yup';

import API from '../../../Services/API';

import { TextField } from '../../UI/FormFields';
import DropDown from '../../UI/DropDown';
import US_STATES from '../../../Services/StaticData';


const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const defaultCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  accountStatus: 'Active',
  signedUpOn: Date.now
};

const formSchema = {
  firstName: yup.string()
    .required('First name is required')
    .default(defaultCustomer.name),
  lastName: yup.string()
    .required('Last name is required')
    .default(defaultCustomer.name),
  email: yup.string().email()
    .required('A valid email address is required')
    .default(defaultCustomer.email),
  phone: yup.string()
    .required('A valid phone number is required')
    .default(defaultCustomer.phone),
  state: yup.string()
    .required('A valid US State is required')
    .default("CA")
};

export default function CustomerForm({ customerId, onComplete }) {
  const classes = useStyles();
  const [customer, setCustomer] = React.useState(null);

  React.useEffect(() => {
    if (customerId) {
      if (customerId === 'new') {
        setCustomer(defaultCustomer);
      } else {
        API.Customers
          .get(customerId)
          .then(customer => setCustomer(customer));
      }
    }
  }, [customerId]);

  if (customer && customer.glid) {
    delete formSchema.password;
    delete formSchema.passwordConfirmation;
  }

  const validationSchema = yup.object().shape(formSchema);

  const loading = () => (
    <Box
      className={classes.loader}
    >
      <CircularProgress />
    </Box>
  );

  const form = (customer) => (
    <formik.Formik
      initialValues={{
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let promise;
        const customerId = customer.glid;

        if (customerId) {
          promise = API.Customers.update(customerId, values);
        } else {
          promise = API.Customers.create(values);
        }

        promise.then(res => {
          setSubmitting(false);
          onComplete('Customer ' + (customerId === null ? 'Created' : 'Updated'));
        });
      }}
    >
      {({ errors, isSubmitting }) => (
        <formik.Form autoComplete="off">
          <formik.Field
            component={TextField}
            name="firstName"
            label="First Name"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={TextField}
            name="lastName"
            label="Last Name"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={TextField}
            name="email"
            label="Email"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={TextField}
            name="phone"
            label="Phone"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={DropDown}
            name="state"
            label="State"
            margin="normal"
            dataSource={US_STATES}
            fullWidth
          >           
          </formik.Field>
          <Box className={classes.formActions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              margin="normal"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              {(customer._id ? 'Update' : 'Create')} Customer
            </Button>
          </Box>
        </formik.Form>
      )}
    </formik.Formik>
  );

  return customer === null ? loading() : form(customer);
}