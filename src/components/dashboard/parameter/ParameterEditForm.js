import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

const ParameterEditForm = (props) => {
  const { user } = useAuth();
  const {
    parameter,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        code: parameter.code || '',
        dscp: parameter.dscp || '',
        value: parameter.value || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          code: Yup
            .string()
            .max(60)
            .required('Code is required'),
          dscp: Yup
            .string()
            .max(200)
            .required('Description is required'),
          value: Yup
            .string()
            .max(500)
            .required('Value is required')
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          await axios.post(process.env.REACT_APP_PARAM_UPDATE, values);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Parameter updated', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
          });
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
                    error={Boolean(touched.code && errors.code)}
                    fullWidth
                    helperText={touched.code && errors.code}
                    label="Code"
                    name="code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    disabled
                    value={values.code}
                    variant="outlined"
                  />
                </Grid>
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
                    value={values.dscp}
                    disabled={user.role === 'IAM'}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.value && errors.value)}
                    fullWidth
                    helperText={touched.value && errors.value}
                    label="Value"
                    name="value"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.value}
                    disabled={user.role === 'IAM'}
                    variant="outlined"
                  />
                </Grid>
                <Grid item/>
              </Grid>
              {user.role === 'ROOT' && (<Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Update
                </Button>
              </Box>)}
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

ParameterEditForm.propTypes = {
  // @ts-ignore
  parameter: PropTypes.object.isRequired
};

export default ParameterEditForm;
