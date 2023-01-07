import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import numeral from 'numeral';
import axios from 'axios';
import TrashIcon from '../../../icons/Trash';

const TransactionCreateForm = (props) => {
  const {
    transaction,
    customers,
    items,
    ...other
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [cashbackLimit, setCashbackLimit] = useState(0);
  const [orders, setOrders] = useState([]);
  const [currentButton, setCurrentButton] = useState('transaction');

  return (
    <Formik
      initialValues={{
        customerCode: transaction.customerCode || '',
        receiptNumber: transaction.receiptNumber || '',
        cashbackUsed: transaction.cashbackUsed || 0,
        cashbackLimit: cashbackLimit || 0,
        itemCode: '',
        quantity: 0,
        currentButton: currentButton || 'transaction',
        submit: null,
        isAddOrder: false,
        isSubmitOrder: false,
        deleteOrderIndex: -1
      }}
      validationSchema={Yup
        .object()
        .shape({
          customerCode: Yup
            .string()
            .when('isAddOrder', {
              is: false,
              then: Yup
                .string()
                .max(60)
                .required('Customer Code is required')
            }),
          receiptNumber: Yup
            .string()
            .when('isAddOrder', {
              is: false,
              then: Yup
                .string()
                .max(60)
            }),
          cashbackUsed: Yup
            .number()
            .when('isAddOrder', {
              is: false,
              then: Yup
                .number()
                .min(0, 'Cashback Used must be greater than or equal to ' + cashbackLimit)
                .max(cashbackLimit, 'Cashback Used must be less than or equal to ' + cashbackLimit)
                .required('Cashback Used is required')
            }),
          itemCode: Yup
            .string()
            .when('isAddOrder', {
              is: true,
              then: Yup
                .string()
                .max(60)
                .required('Item Code is required')
            }),
          quantity: Yup
            .number()
            .min(0)
            .when('isAddOrder', {
              is: true,
              then: Yup
                .number()
                .moreThan(0, 'Quantity must be greater than 0')
                .required('Quantity is required')
            })
        })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          if (values.isAddOrder) {
            let result = items.filter(item => {
              return item.code === values.itemCode;
            });

            let newOrder = {
              'dscp': result[0].dscp,
              'price': result[0].price,
              'units': result[0].units,
              'quantity': values.quantity
            };
            setOrders([...orders, newOrder]);

            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Order added', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
          }
          if (values.deleteOrderIndex !== -1) {
            orders.splice(values.deleteOrderIndex, 1);
            enqueueSnackbar('Order deleted', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
          }
          if (values.isSubmitOrder) {
            if (values.details && values.details.length === 0) {
              enqueueSnackbar('Order list is empty', {
                anchorOrigin: {
                  horizontal: 'right',
                  vertical: 'top'
                },
                variant: 'error'
              });
              return;
            }

            await axios.post(process.env.REACT_APP_TRXN_ADD, values);
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Transaction added', {
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
                    error={Boolean(touched.customerCode && errors.customerCode)}
                    fullWidth
                    helperText={touched.customerCode && errors.customerCode}
                    label="Customer Code"
                    name="customerCode"
                    onBlur={handleBlur}
                    onChange={async (e) => {
                      let result = customers.filter(customer => {
                        return customer.code === e.target.value;
                      });

                      if (result.length > 0) {
                        setCashbackLimit(result[0].cashbackBalance);
                      } else {
                        setCashbackLimit(0);
                      }
                      handleChange(e);
                    }}
                    required
                    value={values.customerCode}
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                  >
                    <option/>
                    {customers
                      .sort((a, b) => (a.d > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                      .map((customer) => (
                        <option
                          key={customer.code}
                          value={customer.code}
                        >
                          {customer.name} - {customer.code}
                        </option>
                      ))}
                  </TextField>
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
                    error={Boolean(touched.cashbackUsed && errors.cashbackUsed)}
                    fullWidth
                    helperText={touched.cashbackUsed && errors.cashbackUsed}
                    label={'Cashback Used (Max: ' + cashbackLimit + ')'}
                    name="cashbackUsed"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cashbackUsed}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item
                      md={6}
                      xs={12}
                />

                {/*[START] Add Transaction Orders*/}
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Card>
                    <CardHeader title="Construct Order List"/>
                    <Divider/>
                    <CardContent>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            error={Boolean(touched.itemCode && errors.itemCode)}
                            fullWidth
                            helperText={touched.itemCode && errors.itemCode}
                            label="Item Code"
                            name="itemCode"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            value={values.itemCode}
                            select
                            variant="outlined"
                          >
                            <MenuItem/>
                            {items
                              .map((item) => (
                                <MenuItem
                                  key={item.code}
                                  value={item.code}
                                  sx={{
                                    whiteSpace: 'unset',
                                    wordBreak: 'break-all'
                                  }}
                                >
                                  <Box component="span">
                                    <Box component="span" sx={{
                                      color: 'white',
                                      fontWeight: 'bold'
                                    }}>
                                      {item.dscp} -&nbsp;
                                      <Box component="span" sx={{
                                        color: 'lightslategrey'
                                      }}>
                                        {item.code}
                                      </Box>
                                    </Box>
                                    <br/>
                                    <Box component="span" sx={{
                                      color: 'deepskyblue',
                                      fontWeight: 'bold'
                                    }}>
                                        € {numeral(item.price)
                                      .format('0,0.00')}
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                        <Grid
                          item
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            error={Boolean(touched.quantity && errors.quantity)}
                            fullWidth
                            helperText={touched.quantity && errors.quantity}
                            label="Quantity"
                            name="quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            value={values.quantity}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider/>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2
                      }}
                    >
                      <Button
                        color="success"
                        disabled={isSubmitting}
                        type="button"
                        onClick={async (e) => {
                          await setFieldValue('isAddOrder', true);
                          await setFieldValue('deleteOrderIndex', -1);
                          await setFieldValue('isSubmitOrder', false);
                          handleSubmit(e);
                        }}
                        variant="contained"
                      >
                        Add Order
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                {/*[END] Add Transaction Orders*/}

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
                        {orders.map((order, index) => (
                          <TableRow>
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
                                <IconButton
                                  onClick={async (e) => {
                                    await setFieldValue('isAddOrder', false);
                                    await setFieldValue('deleteOrderIndex', index);
                                    await setFieldValue('isSubmitOrder', false);
                                    handleSubmit(e);
                                  }}
                                >
                                  <TrashIcon fontSize="small"/>
                                </IconButton>
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </Grid>

                <Grid item/>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="button"
                  onClick={async (e) => {
                    await setFieldValue('isAddOrder', false);
                    await setFieldValue('deleteOrderIndex', -1);
                    await setFieldValue('details', orders);
                    await setFieldValue('isSubmitOrder', true);
                    handleSubmit(e);
                  }}
                  variant="contained"
                >
                  Create Transaction
                </Button>
                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>
                      {errors.submit}
                    </FormHelperText>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

TransactionCreateForm.propTypes = {
  // @ts-ignore
  transaction: PropTypes.object.isRequired
};

export default TransactionCreateForm;
