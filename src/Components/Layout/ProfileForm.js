import React from "react";
import { Box, Button, CircularProgress, makeStyles } from "@material-ui/core";
import { Save as SaveIcon } from "@material-ui/icons";
import * as formik from "formik";
import * as yup from "yup";

import API from "../../Services/API";
import { InputField } from "../UI/FormFields";

const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(7),
    display: "flex",
    justifyContent: "flex-start",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
  },
  buttons: {
    width: "100%",
  },
}));

const defaultUserProfile = {
  name: "",
  email: "",
};

const formSchema = {
  name: yup
    .string()
    .required("Nname is required")
    .default(defaultUserProfile.name),
  email: yup
    .string()
    .email()
    .required("A valid email address is required")
    .default(defaultUserProfile.email),
  password: yup.string().default(""),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .default(""),
};

export default function ProfileForm({ user, onComplete }) {
  const classes = useStyles();

  const validationSchema = yup.object().shape(formSchema);

  const loading = () => (
    <Box className={classes.loader}>
      <CircularProgress />
    </Box>
  );

  const form = (user) => (
    <formik.Formik
      initialValues={{
        name: user.name,
        email: user.email,
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let fd = {};
        Object.keys(values).forEach((key) => {
          if (
            values[key] &&
            values[key] !== "" &&
            key !== "passwordConfirmation"
          ) {
            fd[key] = values[key];
          }
        });

        API.Users.update(user.glid, fd).then((res) => {
          setSubmitting(false);
          onComplete(fd);
        });
      }}
    >
      {({ errors, isSubmitting }) => (
        <formik.Form autoComplete="off">
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
          <Box className={classes.formActions}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              margin="normal"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
            >
              Update Profile
            </Button>
          </Box>
        </formik.Form>
      )}
    </formik.Formik>
  );

  return user === null ? loading() : form(user);
}
