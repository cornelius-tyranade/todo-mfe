import PropTypes from 'prop-types';
import { Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';

const ItemDetailsForm = (props) => {
  const {
    code,
    dscp,
    price,
    units,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardHeader title="Item Details"/>
      <Divider/>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
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
                Description
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {dscp}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Price
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {price}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Units
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {units}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

ItemDetailsForm.propTypes = {
  code: PropTypes.string,
  dscp: PropTypes.string,
  price: PropTypes.number,
  units: PropTypes.string
};

export default ItemDetailsForm;
