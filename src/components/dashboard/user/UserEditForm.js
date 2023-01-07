import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, Grid, TableRow, TextField } from '@material-ui/core';
import axios from 'axios';
import TrashIcon from '../../../icons/Trash';
import { useNavigate } from 'react-router-dom';

const UserEditForm = (props) => {
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
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        submit: null,
        isDeleteButton: false
      }}
      validationSchema={Yup
        .object()
        .shape({
          username: Yup
            .string()
            .max(60)
            .required('Username is required'),
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
            .max(100)
            .required('Role is required'),
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          if (values.isDeleteButton) {
            await axios.post(process.env.REACT_APP_USR_DELETE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('User deleted', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate('/dashboard/users');
          } else {
            await axios.post(process.env.REACT_APP_USR_UPDATE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('User updated', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
          }
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
        setFieldValue,
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
                    disabled
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
              {user.role === 'ROOT' && (<Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Update
                </Button>
                <Button
                  color="primary"
                  type="button"
                  startIcon={<TrashIcon fontSize="small"/>}
                  sx={{
                    ml: 1,
                    backgroundColor: 'error.main',
                    color: 'error.contrastText',
                    '&:hover': {
                      backgroundColor: 'error.dark'
                    }
                  }}
                  disabled={isSubmitting}
                  onClick={async (e) => {
                    await setFieldValue('isDeleteButton', true);
                    handleSubmit(e);
                  }}
                  variant="contained"
                >
                  Delete
                </Button>
              </Box>)}
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

UserEditForm.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired
};

export default UserEditForm;
