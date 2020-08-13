import React from 'react';
import {
  Box, Button, CircularProgress,
  Grid,
  makeStyles
} from '@material-ui/core';
import * as formik from 'formik';
import * as yup from 'yup';

import API from '../../../Services/API';

import { InputField, DropDown, ButtonGroup } from '../../UI/FormFields';
import { US_STATES, ACCOUNT_STATUS, PHONE_REGEX } from '../../../Services/StaticData';
import { parseGLID } from '../../UI/GLID';

const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(7),
    display: 'flex',
    justifyContent: 'flex-start',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center'
  },
  buttons: {
    width: '100%'
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
      street: yup.string().required('Shipping address 1 is required'),
      city: yup.string().required('City is required'),
      state: yup.string().required('US state is required'),
      zip: yup.string().required('Zip is required')
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
                component={InputField}
                name="firstName"
                label="First Name"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
                name="address.street"
                label="Shipping Address 1"
                margin="normal"
                fullWidth
              />
            </Grid> 
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
                name="lastName"
                label="Last Name"
                margin="normal"
                fullWidth
              />
            </Grid> 
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
                name="address.secondary"
                label="Shipping Address 2"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
                name="email"
                label="Email"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
                name="address.city"
                label="City"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
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
                margin="normal"
                fullWidth
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
                message="A blocked account cannot be used to login"
              />
            </Grid>
            <Grid item sm={6}>
              <formik.Field
                component={InputField}
                name="address.zip"
                label="Zip"
                margin="normal"
                fullWidth
              />
            </Grid>          
          </Grid>                
          <Grid container className={classes.formActions} spacing={2}>
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