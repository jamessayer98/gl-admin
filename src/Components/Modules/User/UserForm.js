import React from 'react';
import {
  Box, Button, Select, FormControl, InputLabel, MenuItem,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import {
  Save as SaveIcon
} from '@material-ui/icons';
import * as formik from 'formik';
import * as yup from 'yup';

import API from '../../../Services/API';

import { InputField } from '../../UI/FormFields';
import { parseGLID } from '../../UI/GLID';

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
  role: 2
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
        password: '',
        passwordConfirmation: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let promise;
        const userId = parseGLID(user.glid);

        if (userId) {
          promise = API.Users.update(userId, values);
        } else {
          promise = API.Users.create(values);
        }

        promise.then(res => {
          setSubmitting(false);
          onComplete('User ' + (userId === null ? 'Created' : 'Updated'));
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
          <FormControl
            margin="normal"
            fullWidth
          >
            <InputLabel>Role</InputLabel>
            <formik.Field
              as={Select}
              name="role"
              label="Role"
            >
              <MenuItem value={0} disabled>Super Admin</MenuItem>
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>User</MenuItem>
            </formik.Field>
          </FormControl>
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