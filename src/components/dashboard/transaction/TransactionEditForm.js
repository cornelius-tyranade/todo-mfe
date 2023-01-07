import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import numeral from 'numeral';
import TrashIcon from '../../../icons/Trash';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import useAuth from '../../../hooks/useAuth';

const TransactionEditForm = (props) => {
  const { user } = useAuth();
  const {
    transaction,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        code: transaction.code || '',
        customerCode: transaction.customerCode || '',
        cashbackUsed: transaction.cashbackUsed || '',
        transactionStatus: transaction.transactionStatus || '',
        createDate: transaction.createDate || '',
        receiptNumber: transaction.receiptNumber || '',
        endStateDate: transaction.endStateDate || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          code: Yup
            .string()
            .max(60)
            .required('Code is required'),
          receiptNumber: Yup
            .string()
            .max(60),
          customerCode: Yup
            .string()
            .max(60)
            .required('Customer Code is required')
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          // NOTE: Make API request
          if (values.isRejectButton) {
            await axios.post(process.env.REACT_APP_TRXN_REJECT, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Transaction rejected', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate('/dashboard/transactions');
          } else {
            await axios.post(process.env.REACT_APP_TRXN_APPROVE, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Transaction approved', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate('/dashboard/transactions');
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
                    error={Boolean(touched.customerCode && errors.customerCode)}
                    fullWidth
                    helperText={touched.customerCode && errors.customerCode}
                    label="Customer Code"
                    name="customerCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    disabled
                    value={values.customerCode}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.receiptNumber && errors.receiptNumber)}
                    fullWidth
                    helperText={touched.receiptNumber && errors.receiptNumber}
                    label="Receipt Number"
                    name="receiptNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled
                    value={values.receiptNumber}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.transactionStatus && errors.transactionStatus)}
                    fullWidth
                    helperText={touched.transactionStatus && errors.transactionStatus}
                    label="Transaction Status"
                    name="transactionStatus"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled
                    value={values.transactionStatus}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.createDate && errors.createDate)}
                    fullWidth
                    helperText={touched.createDate && errors.createDate}
                    label="Create Date"
                    name="createDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled
                    value={format(new Date(values.createDate), 'dd-MM-yyyy HH:mm:ss')}
                    variant="outlined"
                  />
                </Grid>
                {values.transactionStatus === 'PAID' && (<Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.endStateDate && errors.endStateDate)}
                    fullWidth
                    helperText={touched.endStateDate && errors.endStateDate}
                    label="End State Date"
                    name="endStateDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled
                    value={format(new Date(values.endStateDate), 'dd-MM-yyyy HH:mm:ss')}
                    variant="outlined"
                  />
                </Grid>)}
                {values.transactionStatus === 'PENDING' && (<Grid item/>)}
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Card>
                    <CardHeader title="Order List"/>
                    <Divider/>
                    <Table>
                      <TableBody>
                        {transaction.details.map((order, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography
                                color="textPrimary"
                                variant="body2"
                              >
                                {order.quantity}x {order.dscp}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                € {numeral(order.price)
                                .format('0,0.00')}/{order.units}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Total Amount
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Cashback Used
                            </Typography>
                            <Typography
                              color="textPrimary"
                              variant="subtitle2"
                            >
                              Cashback Get
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              € {numeral(transaction.totalAmount)
                              .format('0,0.00')}
                            </Typography>
                            <Typography variant="subtitle2">
                              € {numeral(transaction.cashbackUsed)
                              .format('0,0.00')}
                            </Typography>
                            <Typography variant="subtitle2">
                              € {numeral(transaction.cashbackGet)
                              .format('0,0.00')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                </Grid>
                <Grid item/>
              </Grid>
              {user.role === 'ROOT' && (<Box sx={{ mt: 2 }}>
                {values.transactionStatus === 'PENDING' &&
                (<Button
                  color="success"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Approve
                </Button>)}
                {values.transactionStatus === 'PENDING' &&
                (<Button
                  color="primary"
                  type="button"
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
                    await setFieldValue('isRejectButton', true);
                    handleSubmit(e);
                  }}
                  variant="contained"
                >
                  Reject
                </Button>)}
              </Box>)}
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

TransactionEditForm.propTypes = {
  // @ts-ignore
  transaction: PropTypes.object.isRequired
};

export default TransactionEditForm;
