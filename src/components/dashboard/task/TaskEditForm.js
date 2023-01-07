import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {Box, Button, Card, Checkbox, Grid, TextField, Typography} from '@material-ui/core';
import axios from 'axios';
import TrashIcon from '../../../icons/Trash';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const TaskEditForm = (props) => {
  const { user } = useAuth();
  const {
    task,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        id: task.id || '',
        description: task.description || '',
        status: task.status || '',
        submit: null,
        isDeleteButton: false
      }}
      validationSchema={Yup
        .object()
        .shape({
            description: Yup
                .string()
                .max(200)
                .required('Description is required')
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          if (values.isDeleteButton) {
            await axios.post(process.env.REACT_APP_TASK_DELETE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Task deleted', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate('/dashboard/tasks');
          } else {
            if (values.status) {
              values.status = "CHECKED"
            } else {
              values.status = "UNCHECKED"
            }
            await axios.post(process.env.REACT_APP_TASK_UPDATE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Task updated', {
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
                spacing={0}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Description"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
                  <Grid
                      item
                      md={6}
                      xs={12}
                  >
                      {values.status == "CHECKED" ? (
                          <Checkbox
                              color="success"
                              name="status"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              label="Complete"
                              defaultChecked
                              style={{
                                  transform: "scale(1.4)",
                              }}
                          />

                      ) : (
                          <Checkbox
                              color="success"
                              name="status"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              label="Complete"
                              style={{
                                  transform: "scale(1.4)",
                              }}
                          />
                      )}
                      <Typography
                          display="inline"
                          color="textSecondary"
                          variant="body2"
                          style={{
                              fontSize: '1.1rem',
                          }}
                      >
                          Complete
                      </Typography>
                  </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
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
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

TaskEditForm.propTypes = {
  // @ts-ignore
  task: PropTypes.object.isRequired
};

export default TaskEditForm;
