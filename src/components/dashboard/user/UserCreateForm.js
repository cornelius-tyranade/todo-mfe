import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserCreateForm = (props) => {
  const {
    user,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        username: user.username || '',
        password: user.password || '',
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          username: Yup
            .string()
            .max(60)
            .required('Username is required'),
          password: Yup
            .string()
            .max(200)
            .required('Password is required'),
          name: Yup
            .string()
            .max(200)
            .required('Name is required'),
          email: Yup
            .string()
            .email('Must be a valid email')
            .max(100)
            .required('Email is required'),
          role: Yup
            .string()
            .max(200)
            .required('Role is required'),
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          await axios.post(process.env.REACT_APP_USR_ADD, values);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('User added', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
          });
          navigate('/dashboard/users');
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
                      error={Boolean(touched.username && errors.username)}
                      fullWidth
                      helperText={touched.username && errors.username}
                      label="Username"
                      name="username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.username}
                      variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                      error={Boolean(touched.password && errors.password)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.password}
                      type={"password"}
                      variant="outlined"
                  />
                </Grid>
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
                      error={Boolean(touched.role && errors.role)}
                      fullWidth
                      helperText={touched.role && errors.role}
                      label="Role"
                      name="role"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      value={values.role}
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

UserCreateForm.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default UserCreateForm;
