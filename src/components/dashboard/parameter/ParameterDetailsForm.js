import PropTypes from 'prop-types';
import { Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';

const ParameterDetailsForm = (props) => {
  const {
    code,
    dscp,
    value,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardHeader title="Parameter Details"/>
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
                Value
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {value}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

ParameterDetailsForm.propTypes = {
  code: PropTypes.string,
  dscp: PropTypes.string,
  value: PropTypes.string
};

export default ParameterDetailsForm;
