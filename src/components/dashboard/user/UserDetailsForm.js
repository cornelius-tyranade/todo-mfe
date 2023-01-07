import PropTypes from 'prop-types';
import { Box, Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';

const UserDetailsForm = (props) => {
  const {
    username,
    name,
    email,
    role,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardHeader title="User Details"/>
      <Divider/>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ minWidth: 150 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Username
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {username}
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
          <TableRow>
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
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                  color="textPrimary"
                  variant="subtitle2"
              >
                Role
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                  color="textSecondary"
                  variant="body2"
              >
                {role}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

UserDetailsForm.propTypes = {
  username: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string
};

export default UserDetailsForm;
