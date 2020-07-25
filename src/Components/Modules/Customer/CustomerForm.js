import React from 'react';
import {
  Box, Button, CircularProgress,
  Grid,
  makeStyles
} from '@material-ui/core';
import * as formik from 'formik';
import * as yup from 'yup';

import API from '../../../Services/API';

import { TextField } from '../../UI/FormFields';
import DropDown from '../../UI/DropDown';
import ButtonGroup from '../../UI/ButtonGroup';
import { US_STATES, ACCOUNT_STATUS, PHONE_REGEX } from '../../../Services/StaticData';
import { parseGLID } from '../../UI/GLID';

const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-start',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center'
  },
  buttons: {
    width: '90%'
  }
}));

const defaultCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  accountStatus: 'Active',
  signedUpOn: Date.now,
  address: {
    street: '',
    secondary: '',
    city: '',
    state: '',
    zip: ''
  }
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
    .matches(PHONE_REGEX, 'Phone number is not valid')
    .default(defaultCustomer.phone),
  address: yup.object().shape({
      state: yup.string().required('US state is required')
  }),
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
          .get(parseGLID(customerId))
          .then(customer => setCustomer(customer));
      }
    }
  }, [customerId]);

  const validationSchema = yup.object().shape(formSchema);

  const loading = () => (
    <Box className={classes.loader}>
      <CircularProgress />
    </Box>
  );

  const form = (customer) => (
    <formik.Formik
      initialValues={{
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,        
        accountStatus: customer.accountStatus,
        address: {
          street: customer.address.street,
          secondary: customer.address.secondary,
          city: customer.address.city,
          state: customer.address.state,
          zip: customer.address.zip
        }        
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
          <Grid container spacing={4}>
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="firstName"
                label="First Name"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="address.street"
                label="Shipping Address 1"
                margin="normal"
                fullWidth
              />
            </Grid> 
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="lastName"
                label="Last Name"
                margin="normal"
                fullWidth
              />
            </Grid> 
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="address.secondary"
                label="Shipping Address 2"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="email"
                label="Email"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="address.city"
                label="City"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="phone"
                label="Phone"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={DropDown}
                name="address.state"
                label="State"
                dataSource={US_STATES}
                dataKey="name"
                dataValue="abbrev"                
              />
            </Grid> 
            <Grid item sm={6}>
              <formik.Field
                component={ButtonGroup}
                name="accountStatus"
                label="Account Status"
                dataSource={ACCOUNT_STATUS}
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={TextField}
                name="address.zip"
                label="Zip"
                margin="normal"
                fullWidth
              />
            </Grid>          
          </Grid>                
          <Grid container className={classes.formActions}>
            <Grid item sm>
              <Button
                className={classes.buttons}
                variant="outlined"
                color="default"
                margin="normal"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item sm>
              <Button
                className={classes.buttons}
                variant="contained"
                color="secondary"
                type="submit"
                margin="normal"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </Grid>
            <Grid item sm>
              <Button
                className={classes.buttons}
                variant="outlined"
                color="default"
                margin="normal"
                disabled={isSubmitting}
              >
                Delete
              </Button>
            </Grid>         
          </Grid>
        </formik.Form>
      )}
    </formik.Formik>
  );

  return customer === null ? loading() : form(customer);
}