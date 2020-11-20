import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  makeStyles,
  Typography,
  InputAdornment,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import { Save as SaveIcon, Delete as DeleteIcon } from "@material-ui/icons";
import * as formik from "formik";
import * as yup from "yup";
import InputField from "../../UI/FormFields/InputField";
import MoneyField from "../../UI/FormFields/MoneyField";

import API from "../../../Services/API";

const useStyles = makeStyles((theme) => ({
  root: {},
  outerGrid: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  innerGrid: {
    maxHeight: "85vh",
  },
  row: {
    marginBottom: theme.spacing(2),
  },
  categoryHeaderBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  actionColumn: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[200],
  },
}));

const defaultEntry = {
  limit: 0.0,
  price: [
    { layers: 2, multiplier: 0.0, offset: 0.0 },
    { layers: 4, multiplier: 0.0, offset: 0.0 },
  ],
};

const schema = yup.object().shape({
  categories: yup.array().of(
    yup.object().shape({
      limit: yup
        .number()
        .required("Limit is required")
        .positive("Limit must be positive"),
      price: yup.array().of(
        yup.object().shape({
          layers: yup.number().required().positive(),
          multiplier: yup
            .number()
            .required("Multiplier is required")
            .min(0, "Multiplier must greater than or equal to zero"),
          offset: yup
            .number()
            .required("Offset is required")
            .min(0, "Multiplier must greater than or equal to zero"),
        })
      ),
    })
  ),
});

export default function PricingTable() {
  const classes = useStyles();
  const [pricingData, setPricingData] = React.useState(null);

  React.useEffect(() => {
    API.Settings.get("pricingTable").then((value) => {
      setPricingData(value);
    });
  }, []);

  const handleSubmit = (values, { setSubmitting }) => {
    API.Settings.set("pricingTable", values.categories).then((value) => {
      setPricingData(value);
      setSubmitting(false);
    });
  };

  const renderCategoryErrors = (errors) => {
    let messages = [];
    let makeError = (message) => (
      <Typography
        key={`error-${messages.length + 1}`}
        variant="body2"
        color="error"
      >
        {message}
      </Typography>
    );

    if (errors.limit) {
      messages.push(makeError(errors.limit));
    }

    if (errors.price) {
      errors.price.forEach((priceError) => {
        if (priceError.layers) {
          messages.push(makeError(priceError.layers));
        }
        if (priceError.multiplier) {
          messages.push(makeError(priceError.multiplier));
        }
        if (priceError.offset) {
          messages.push(makeError(priceError.offset));
        }
      });
    }

    return messages;
  };

  const renderCategory = (
    errors,
    category,
    categoryIndex,
    { push, remove }
  ) => (
    <Grid key={categoryIndex} item xs={12} sm={6}>
      <TableContainer className={classes.row} component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow key="price-outer">
              <TableCell
                component="th"
                scope="row"
                rowSpan={1 + category.price.length}
              >
                <Box className={classes.categoryHeaderBox}>
                  <Typography variant="h6" noWrap>
                    Category {String.fromCharCode(categoryIndex + 65)}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => remove(categoryIndex)}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Box>
                <formik.Field
                  component={InputField}
                  name={`categories[${categoryIndex}].limit`}
                  placeholder="Limit"
                  size="small"
                  margin="normal"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        m<sup>2</sup>
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                Layers
              </TableCell>
              <TableCell component="th" scope="row">
                Multiplier
              </TableCell>
              <TableCell component="th" scope="row">
                Offset
              </TableCell>
            </TableRow>

            <formik.FieldArray name={`categories[${categoryIndex}].price`}>
              {(arrayHelpers) => {
                return category.price.map((price, priceIndex) =>
                  renderPrices(categoryIndex, price, priceIndex, arrayHelpers)
                );
              }}
            </formik.FieldArray>

            {errors.categories && errors.categories[categoryIndex] && (
              <TableRow key="category-errors">
                <TableCell colSpan={4}>
                  {renderCategoryErrors(errors.categories[categoryIndex])}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );

  const renderPrices = (categoryIndex, price, priceIndex, arrayHelpers) => (
    <TableRow key={`price-${priceIndex}`}>
      <TableCell>
        <formik.Field
          component={InputField}
          name={`categories[${categoryIndex}].price[${priceIndex}].layers`}
          readOnly={true}
          size="small"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </TableCell>
      <TableCell>
        <formik.Field
          component={MoneyField}
          name={`categories[${categoryIndex}].price[${priceIndex}].multiplier`}
          placeholder="Multiplier"
          size="small"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <formik.Field
          component={MoneyField}
          name={`categories[${categoryIndex}].price[${priceIndex}].offset`}
          placeholder="Offset"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </TableCell>
    </TableRow>
  );

  return (
    pricingData && (
      <formik.Formik
        initialValues={{ categories: pricingData || [defaultEntry] }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, isSubmitting }) => {
          return (
            <formik.Form>
              <Grid container className={classes.outerGrid}>
                <Grid item xs={12} sm={10}>
                  <Box p={3}>
                    <Typography variant="h4" paragraph>
                      Pricing Categories
                    </Typography>
                    <formik.FieldArray
                      name="categories"
                      render={(arrayHelpers) => (
                        <>
                          <Grid
                            container
                            spacing={3}
                            className={classes.innerGrid}
                          >
                            {values.categories.map((category, categoryIndex) =>
                              renderCategory(
                                errors,
                                category,
                                categoryIndex,
                                arrayHelpers
                              )
                            )}
                          </Grid>

                          <Button
                            variant="contained"
                            color="secondary"
                            margin="normal"
                            onClick={() => arrayHelpers.push(defaultEntry)}
                          >
                            + Add
                          </Button>
                        </>
                      )}
                    ></formik.FieldArray>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2} className={classes.actionColumn}>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      margin="normal"
                      fullWidth
                      disabled={isSubmitting}
                      startIcon={<SaveIcon />}
                    >
                      {isSubmitting && <span>Saving...</span>}
                      {!isSubmitting && <span>Save</span>}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </formik.Form>
          );
        }}
      </formik.Formik>
    )
  );
}
