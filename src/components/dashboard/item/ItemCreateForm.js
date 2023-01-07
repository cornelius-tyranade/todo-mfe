import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemCreateForm = (props) => {
  const {
    item,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        dscp: item.dscp || '',
        price: item.price || '',
        units: item.units || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          dscp: Yup
            .string()
            .max(200)
            .required('Description is required'),
          price: Yup.number()
            .min(0)
            .required('Price is required'),
          units: Yup
            .string()
            .max(100)
            .required('Units is required'),
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          await axios.post(process.env.REACT_APP_ITEM_ADD, values);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Item added', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
          });
          navigate('/dashboard/items');
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          {...other}
        >
          <Card>
            <Box sx={{ p: 3 }}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.dscp && errors.dscp)}
                    fullWidth
                    helperText={touched.dscp && errors.dscp}
                    label="Description"
                    name="dscp"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.dscp}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.price && errors.price)}
                    fullWidth
                    helperText={touched.price && errors.price}
                    label="Price"
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.price}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.units && errors.units)}
                    fullWidth
                    helperText={touched.units && errors.units}
                    label="Units"
                    name="units"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.units}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Add
                </Button>
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

ItemCreateForm.propTypes = {
  // @ts-ignore
  item: PropTypes.object.isRequired
};

export default ItemCreateForm;
