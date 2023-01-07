import PropTypes from 'prop-types';
import {Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';
import numeral from 'numeral';

const TransactionOrdersForm = (props) => {
  const {
    details,
    totalAmount,
    cashbackUsed,
    netTotalAmount,
    cashbackGet,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardHeader title="Order Details"/>
      <Divider/>
      <Table>
        <TableBody>
          {details
            .map((detail, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                  >
                    {detail.quantity}x {detail.dscp}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    € {numeral(detail.price)
                    .format('0,0.00')}/{detail.units}
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
                Net Total Amount (Total Amount - Cashback Used)
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
                € {numeral(totalAmount)
                .format('0,0.00')}
              </Typography>
              <Typography variant="subtitle2">
                € {numeral(cashbackUsed)
                .format('0,0.00')}
              </Typography>
              <Typography variant="subtitle2">
                € {numeral(netTotalAmount)
                .format('0,0.00')}
              </Typography>
              <Typography variant="subtitle2">
                € {numeral(cashbackGet)
                .format('0,0.00')}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

TransactionOrdersForm.propTypes = {
  details: PropTypes.array,
  totalAmount: PropTypes.number,
  cashbackUsed: PropTypes.number,
  netTotalAmount: PropTypes.number,
  cashbackGet: PropTypes.number,
};

export default TransactionOrdersForm;
