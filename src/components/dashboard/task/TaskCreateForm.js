import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {Box, Button, Card, Checkbox, Grid, Link, TextField, Typography} from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TaskCreateForm = (props) => {
  const {
    task,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        description: task.description || '',
        status: task.status || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          description: Yup.string()
              .max(200)
              .required('Description is required'),
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
            // NOTE: Make API request
            if (values.status) {
                values.status = "CHECKED"
            } else {
                values.status = "UNCHECKED"
            }
            await axios.post(process.env.REACT_APP_TASK_ADD, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Task added', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
            });
            navigate('/dashboard/tasks');
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
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Description"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
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

TaskCreateForm.propTypes = {
  // @ts-ignore
  task: PropTypes.object.isRequired
};

export default TaskCreateForm;
