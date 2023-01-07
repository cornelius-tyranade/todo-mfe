import PropTypes from 'prop-types';
import { Card, CardHeader, Divider, Link, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import Label from '../../Label';
import useAuth from '../../../hooks/useAuth';

const TransactionDetailsForm = (props) => {
  const { user } = useAuth();
  const {
    code,
    customerCode,
    customerName,
    transactionStatus,
    createDate,
    receiptNumber,
    endStateDate,
    receiptUrl,
    receiptUrlExpiredDate,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardHeader title="Transaction Details"/>
      <Divider/>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                sx={{ minWidth: 150 }}
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
                Receipt Number
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {receiptNumber}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Customer Info
              </Typography>
            </TableCell>
            <TableCell>
              <Link
                color="inherit"
                component={RouterLink}
                to={'/dashboard/customers/' + customerCode}
                variant="subtitle2"
              >
                {customerName}
              </Link>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                {customerCode}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Transaction Status
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                <Label color={transactionStatus === 'PAID' ? 'success' : transactionStatus === 'REJECTED' ? 'error' : 'primary'}>
                  {transactionStatus}
                </Label>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Create Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {format(new Date(createDate), 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </TableCell>
          </TableRow>
          {transactionStatus === 'PAID' && (<TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Approve Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {format(new Date(endStateDate), 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </TableCell>
          </TableRow>)}
          {user.role === 'ROOT' && (<TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Receipt Url
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ wordBreak:'break-word'}}
              >
                <Link
                  href={receiptUrl}
                  color="textSecondary"
                  variant="subtitle2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {receiptUrl}
                </Link>
              </Typography>
            </TableCell>
          </TableRow>)}
          {user.role === 'ROOT' && (<TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Receipt Expired Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {format(new Date(receiptUrlExpiredDate), 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </Card>
  );
};

TransactionDetailsForm.propTypes = {
  code: PropTypes.string,
  customerCode: PropTypes.string,
  customerName: PropTypes.string,
  transactionStatus: PropTypes.string,
  createDate: PropTypes.string,
  endStateDate: PropTypes.string,
  receiptUrl: PropTypes.string,
  receiptUrlExpiredDate: PropTypes.string
};

export default TransactionDetailsForm;
