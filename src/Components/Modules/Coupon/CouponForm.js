import React from "react";
import { Box, CircularProgress, makeStyles, Button } from "@material-ui/core";
import * as formik from "formik";
import * as yup from "yup";

import API from "../../../Services/API";

import { InputField, DropDown } from "../../UI/FormFields";
import { parseGLID } from "../../UI/GLID";

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

const defaultCoupon = {
  name: "",
  code: "",
  type: null,
  value: 0,
  uses: 0,
  status: "enabled",
};

const formSchema = {
  name: yup.string().required("Name is required").default(defaultCoupon.name),
  code: yup.string().required("Code is required").default(defaultCoupon.name),
  type: yup.string().required("Type is required").default(defaultCoupon.name),
  value: yup
    .number()
    .positive("Value must be a positive number")
    .required("Value is required")
    .default(defaultCoupon.name),
  status: yup
    .string()
    .required("Status is required")
    .default(defaultCoupon.status),
};

export default function CouponForm({ couponId, onComplete }) {
  const classes = useStyles();
  const [coupon, setCoupon] = React.useState(null);

  React.useEffect(() => {
    if (couponId) {
      if (couponId === "new") {
        setCoupon(defaultCoupon);
      } else {
        API.Coupons.get(parseGLID(couponId)).then((coupon) =>
          setCoupon(coupon)
        );
      }
    }
  }, [couponId]);

  const validationSchema = yup.object().shape(formSchema);

  const loading = () => (
    <Box className={classes.loader}>
      <CircularProgress />
    </Box>
  );

  const form = (coupon) => (
    <formik.Formik
      initialValues={{
        name: coupon.name,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        uses: coupon.uses,
        status: coupon.status,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let promise;
        const couponId = coupon.glid;

        if (couponId) {
          promise = API.Coupons.update(couponId, values);
        } else {
          promise = API.Coupons.create(values);
        }

        promise.then((res) => {
          setSubmitting(false);
          onComplete("Coupon " + (couponId === null ? "Created" : "Updated"));
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
            name="code"
            label="Code"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={DropDown}
            name="type"
            label="Type"
            margin="normal"
            fullWidth
            dataSource={[
              { label: "Percent", value: "percent" },
              { label: "Flat Rate", value: "flat" },
            ]}
          />
          <formik.Field
            component={InputField}
            name="value"
            label="Value"
            margin="normal"
            fullWidth
          />
          <formik.Field
            component={DropDown}
            name="status"
            label="Status"
            margin="normal"
            fullWidth
            dataSource={[
              { label: "Enabled", value: "enabled" },
              { label: "Disabled", value: "disabled" },
            ]}
          />
          <Box>
            <Button
              className={classes.buttons}
              variant="contained"
              color="secondary"
              type="submit"
              margin="normal"
              size="large"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </Box>
        </formik.Form>
      )}
    </formik.Formik>
  );

  return coupon === null ? loading() : form(coupon);
}
