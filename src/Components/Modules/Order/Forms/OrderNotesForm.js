import React from "react";
import { Box, Button, makeStyles } from "@material-ui/core";
import { Save as SaveIcon } from "@material-ui/icons";
import * as formik from "formik";
import * as yup from "yup";

import API from "../../../../Services/API";
import { InputField } from "../../../UI/FormFields";

const useStyles = makeStyles((theme) => ({
  formActions: {
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const validationSchema = yup.object().shape({
  notes: yup.string(),
});

export default function OrderNotesForm({ order, onComplete }) {
  const classes = useStyles();

  return (
    <formik.Formik
      initialValues={{ notes: order.notes }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let newOrderValues = { ...order, notes: values.notes };
        API.Orders.update(order.glid, newOrderValues).then(() => {
          setSubmitting(false);
          onComplete("Order notes updated", newOrderValues);
        });
      }}
    >
      {({ errors, isSubmitting }) => (
        <formik.Form autoComplete="off">
          <formik.Field
            component={InputField}
            name="notes"
            label="Notes"
            multiline
            fullWidth
            rows={8}
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
