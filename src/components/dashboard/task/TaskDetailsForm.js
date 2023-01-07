import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import moment from 'moment';

const TaskDetailsForm = (props) => {
  const {
    id,
    description,
    status,
    createDate,
    updateDate,
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
                Description
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {description}
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
            {status == "CHECKED" ? (
                <TableCell>
                  <Typography
                      color="textSecondary"
                      variant="body2"
                  >
                    COMPLETE
                  </Typography>
                </TableCell>
            ) : (
                <TableCell>
                  <Typography
                      color="textSecondary"
                      variant="body2"
                  >
                    INCOMPLETE
                  </Typography>
                </TableCell>
            )}
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
                {(moment(createDate).format("dddd, MMM DD HH:mm a"))}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                  color="textPrimary"
                  variant="subtitle2"
              >
                Last Update
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                  color="textSecondary"
                  variant="body2"
              >
                {updateDate ? (moment(updateDate).format("dddd, MMM DD HH:mm a")) : (<p>No Update</p>)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

TaskDetailsForm.propTypes = {
  id: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
};

export default TaskDetailsForm;
