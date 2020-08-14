import React from 'react';
import {
  Box, Button,
  CircularProgress,
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import {
  Save as SaveIcon
} from '@material-ui/icons';
import * as formik from 'formik';
import * as yup from 'yup';

import API from '../../../Services/API';

import { InputField, DropDown, Switch } from '../../UI/FormFields';
import { parseGLID } from '../../UI/GLID';
import { roles } from '../../../Services/Auth';

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

const defaultUser = {
  username: '',
  name: '',
  email: '',
  role: 2,
  enabled: true
};

const formSchema = {
  username: yup.string()
    .required('Username is required')
    .default(defaultUser.username),
  name: yup.string()
    .required('Name is required')
    .default(defaultUser.name),
  email: yup.string()
    .required('A valid email address is required')
    .default(defaultUser.email),
  role: yup.number()
    .required('Role is required')
    .default(defaultUser.role),
  enabled: yup.boolean()
    .required('Enabled is required')
    .default(defaultUser.enabled),
  password: yup.string()
    .default('')
    .required('Password is required'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .default('')
};

export default function UserForm({ userId, onComplete }) {
  const classes = useStyles();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (userId) {
      if (userId === 'new') {
        setUser(defaultUser);
      } else {
        API.Users
          .get(parseGLID(userId))
          .then(user => setUser(user));
      }
    }
  }, [userId]);

  if (user && user._id) {
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

  const form = (user) => (
    <formik.Formik
      initialValues={{
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        enabled: user.enabled,
        password: '',
        passwordConfirmation: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let promise;
        const userId = parseGLID(user.glid);

        if (userId) {
          delete values.password;
          delete values.passwordConfirmation;
          promise = API.Users.update(userId, values);
        } else {
          promise = API.Users.create(values);
        }

        promise.then(res => {
          setSubmitting(false);
          onComplete('User ' + (userId === null ? 'created' : 'updated'));
        });
      }}
    >
      {({ errors, isSubmitting }) => (
        <formik.Form autoComplete="off">
          <formik.Field
            component={InputField}
            name="username"
            label="Username"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={InputField}
            name="name"
            label="Name"
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
          {!user._id && (
            <React.Fragment>
              <formik.Field
                component={InputField}
                name="password"
                label="Password"
                type="password"
                margin="normal"
                fullWidth
              />
              <formik.Field
                component={InputField}
                name="passwordConfirmation"
                label="Password (confirm)"
                type="password"
                margin="normal"
                fullWidth
              />
            </React.Fragment>
          )}
          <formik.Field
            component={DropDown}
            name="role"
            label="Role"
            margin="normal"
            fullWidth
            dataSource={[
              { label: 'Super Admin', value: roles.superadmin, disabled: true },
              { label: 'Admin', value: roles.admin },
              { label: 'Manufacturer', value: roles.manufacturer }
            ]}
          />
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Typography>Account Status: </Typography>
            </Grid>
            <Grid item>
              <formik.Field
                component={Switch}
                name="enabled"
                label="Enabled"
              />                
            </Grid>
          </Grid>
          <Typography paragraph variant="body2">A disabled account cannot be used to log in.</Typography>
          <Box className={classes.formActions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              margin="normal"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              {(user._id ? 'Update' : 'Create')} User
            </Button>
          </Box>
        </formik.Form>
      )}
    </formik.Formik>
  );

  return user === null ? loading() : form(user);
}