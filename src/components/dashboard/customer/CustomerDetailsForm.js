import PropTypes from 'prop-types';
import { Box, Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import numeral from 'numeral';
import useAuth from '../../../hooks/useAuth';

const CustomerDetailsForm = (props) => {
  const { user } = useAuth();
  const {
    code,
    name,
    email,
    mobileNumber,
    address,
    birthday,
    accountBalance,
    cashbackBalance,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardHeader title="Customer Details"/>
      <Divider/>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ minWidth: 150 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Code
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {code}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {name}
              </Typography>
            </TableCell>
          </TableRow>
          {user.role === 'ROOT' && (<TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Email
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {email}
              </Typography>
            </TableCell>
          </TableRow>)}
          {user.role === 'ROOT' && (<TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Mobile Number
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {mobileNumber}
              </Typography>
            </TableCell>
          </TableRow>)}
          {user.role === 'ROOT' && (<TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Address
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {address}
              </Typography>
            </TableCell>
          </TableRow>)}
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Birthday
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {birthday}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Account Balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                € {numeral(accountBalance)
                .format('0,0.00')}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Cashback Balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                € {numeral(cashbackBalance)
                .format('0,0.00')}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

CustomerDetailsForm.propTypes = {
  code: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  mobileNumber: PropTypes.string,
  address: PropTypes.string,
  birthday: PropTypes.string,
  accountBalance: PropTypes.number,
  cashbackBalance: PropTypes.number
};

export default CustomerDetailsForm;
