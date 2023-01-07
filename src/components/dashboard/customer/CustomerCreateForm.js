import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerCreateForm = (props) => {
  const {
    customer,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        code: customer.code || '',
        name: customer.name || '',
        email: customer.email || '',
        mobileNumber: customer.mobileNumber || '',
        address: customer.address || '',
        birthday: customer.birthday || '',
        accountBalance: customer.accountBalance || 0,
        cashbackBalance: customer.cashbackBalance || 0,
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          name: Yup
            .string()
            .max(200)
            .required('Name is required'),
          email: Yup
            .string()
            .email('Must be a valid email')
            .max(100)
            .required('Email is required'),
          mobileNumber: Yup.string()
            .max(100),
          address: Yup.string()
            .max(500),
          birthday: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
          accountBalance: Yup.number()
            .min(0)
            .required('Account Balance is required'),
          cashbackBalance: Yup.number()
            .min(0)
            .required('Cashback Balance is required')
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          await axios.post(process.env.REACT_APP_CUST_ADD, values);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Customer added', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
          });
          navigate('/dashboard/customers');
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
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Full name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.address && errors.address)}
                    fullWidth
                    helperText={touched.address && errors.address}
                    label="Address"
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.mobileNumber && errors.mobileNumber)}
                    fullWidth
                    helperText={touched.mobileNumber && errors.mobileNumber}
                    label="Mobile Number"
                    name="mobileNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.mobileNumber}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.birthday && errors.birthday)}
                    fullWidth
                    helperText={touched.birthday && errors.birthday}
                    label="Birthday (yyyy-MM-dd)"
                    name="birthday"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.birthday}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.accountBalance && errors.accountBalance)}
                    fullWidth
                    helperText={touched.accountBalance && errors.accountBalance}
                    label="Account Balance"
                    name="accountBalance"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.accountBalance}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.cashbackBalance && errors.cashbackBalance)}
                    fullWidth
                    helperText={touched.cashbackBalance && errors.cashbackBalance}
                    label="Cashback Balance"
                    name="cashbackBalance"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cashbackBalance}
                    variant="outlined"
                  />
                </Grid>
                <Grid item/>
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

CustomerCreateForm.propTypes = {
  // @ts-ignore
  customer: PropTypes.object.isRequired
};

export default CustomerCreateForm;
