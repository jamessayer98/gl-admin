import React from 'react';
import { makeStyles, Grid, Paper, TextField, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Lock as LockIcon } from '@material-ui/icons';
import * as Formik from 'formik';
import * as Yup from 'yup';

import bgImage from '../Assets/bg.jpg';

import Auth, { roles } from '../Services/Auth';

const useStyles = makeStyles(theme => ({
  grid: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
    '&:before': {
      content: '""',
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.75,
      backgroundImage: 'url(' + bgImage + ')',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  },
  gridItem: {
    maxWidth: 400
  },
  formWrapper: {
    position: 'relative',
    zIndex: 2,
    padding: theme.spacing(3)
  },
  submit: {
    marginTop: theme.spacing(3)
  },
  error: {
    marginBottom: theme.spacing(1)
  },
  copyright: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: theme.spacing(3),
    color: "white"
  }
}));

export default function LoginPage({ history, location }) {
  const classes = useStyles();

  function handleSubmit({ username, password }, { setStatus, setSubmitting }) {
    setStatus();
    Auth.login(username, password).then(data => {
      if (data.user.role === roles.manufacturer) {
        history.push('/orders');
      } else {
        const { from } = location.state || { from: { pathname: "/dashboard" } };
        history.push(from);
      }
    }).catch(err => {
      setSubmitting(false);
      if (err.response) {
        if (err.response.status === 401) {
          setStatus('Invalid username or password');
        } else {
          setStatus('Error ' + err.response.status + ': ' + err.response.data);
        }
      } else if (err.request) {
        setStatus('Error: ' + err.request);
      } else {
        setStatus('Error: ' + err);
      }
    });
  }

  return ( 
    <Grid
      container
      className={classes.grid}
      justify="center"
      alignItems="center"
    >
      <Grid
        item
        className={classes.gridItem}
        xs={12}
      >
        <Paper
          className={classes.formWrapper}
          elevation={3}
        >
          <Formik.Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required('Username is required'),
              password: Yup.string().required('Password is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, status, isSubmitting }) => (
              <Formik.Form
                autoComplete="off"
              >
                {status && (
                  <Alert
                    className={classes.error}
                    severity="error"
                  >
                    {status}
                  </Alert>
                )}
                <Formik.Field
                  as={TextField}
                  name="username"
                  label="Username"
                  variant="outlined"
                  fullWidth
                />
                <Formik.Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
                <Button
                  className={classes.submit}
                  variant="contained"
                  color="primary"
                  type="submit"
                  margin="normal"
                  startIcon={<LockIcon />}
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </Formik.Form>
            )}
          </Formik.Formik>
        </Paper>        
      </Grid>
    </Grid>
  );
}