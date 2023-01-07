import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
} from '@material-ui/core';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import Scrollbar from '../../Scrollbar';
import useAuth from '../../../hooks/useAuth';

const tabs = [
  {
    label: 'Users',
    value: 'users'
  }
];

const sortOptions = [
  {
    label: 'Username (A-Z)',
    value: 'username|asc'
  },
  {
    label: 'Username (Z-A)',
    value: 'username|desc'
  }
];

const applyFilters = (users, query) => users
  .filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property].toLowerCase()
          .includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }
    return matches;
  });

const applyPagination = (users, page, limit) => users
  .slice(page * limit, page * limit + limit);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (users, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = users.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const constructPageSizeList = (pageSize) => {
  let pageSizeList = [];
  let pageSizeTemp = pageSize;
  let counter = 0;

  while (pageSizeTemp >= 1 && counter < 3) {
    pageSizeList.unshift(pageSizeTemp);
    pageSizeTemp = Math.floor(pageSizeTemp / 2);
    counter++;
  }
  return pageSizeList;
};

const UserListTable = (props) => {
  const { user } = useAuth();
  const {
    users,
    pageSize,
    ...other
  } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [pageSizeList, setPageSizeList] = useState([5, 10, 25]);

  useEffect(() => {
    setPageSizeList(constructPageSizeList(pageSize));
    setLimit(pageSize);
  }, [users, pageSize]);

  const handleTabsChange = (event, value) => {
    setPage(0);
    setQuery('');
    setSort(sortOptions[0].value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const filteredUsers = applyFilters(users, query);
  const sortedUsers = applySort(filteredUsers, sort);
  const paginatedUsers = applyPagination(sortedUsers, page, limit);

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value='users'
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider/>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small"/>
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder={'users'}
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            width: 240
          }}
        >
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                  key={option.value}
                  value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Role
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => {
                return (
                  <TableRow
                    hover
                    key={user.id}
                  >
                    <TableCell sx={{ minWidth: 225 }}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={'/dashboard/users/' + user.username}
                            variant="subtitle2"
                          >
                            {user.username}
                          </Link>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      {user.name}
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      {user.role}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={'/dashboard/users/' + user.username + '/edit'}
                      >
                        <PencilAltIcon fontSize="small"/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={pageSizeList}
      />
    </Card>
  );
};

UserListTable.propTypes = {
  users: PropTypes.array.isRequired
};

export default UserListTable;
