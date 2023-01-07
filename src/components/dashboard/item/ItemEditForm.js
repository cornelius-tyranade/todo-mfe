import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import TrashIcon from '../../../icons/Trash';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const ItemEditForm = (props) => {
  const { user } = useAuth();
  const {
    item,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        code: item.code || '',
        dscp: item.dscp || '',
        price: item.price || '',
        units: item.units || '',
        submit: null,
        isDeleteButton: false
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
            .required('Units is required')
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          if (values.isDeleteButton) {
            await axios.post(process.env.REACT_APP_ITEM_DELETE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Item deleted', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate('/dashboard/items');
          } else {
            await axios.post(process.env.REACT_APP_ITEM_UPDATE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Item updated', {
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
                    error={Boolean(touched.code && errors.code)}
                    fullWidth
                    helperText={touched.code && errors.code}
                    label="Code"
                    name="Code"
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
                    error={Boolean(touched.price && errors.price)}
                    fullWidth
                    helperText={touched.price && errors.price}
                    label="Price"
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.price}
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
                    error={Boolean(touched.units && errors.units)}
                    fullWidth
                    helperText={touched.units && errors.units}
                    label="Units"
                    name="units"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.units}
                    disabled={user.role === 'IAM'}
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

ItemEditForm.propTypes = {
  // @ts-ignore
  item: PropTypes.object.isRequired
};

export default ItemEditForm;
