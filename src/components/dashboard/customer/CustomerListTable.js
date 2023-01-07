import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Avatar,
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
  Typography
} from '@material-ui/core';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';
import useAuth from '../../../hooks/useAuth';

const tabs = [
  {
    label: 'Customers',
    value: 'customers'
  }
];

const sortOptions = [
  {
    label: 'Name (A-Z)',
    value: 'name|asc'
  },
  {
    label: 'Name (Z-A)',
    value: 'name|desc'
  }
];

const applyFilters = (customers, query) => customers
  .filter((customer) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (customer[property].toLowerCase()
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

const applyPagination = (customers, page, limit) => customers
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

const applySort = (customers, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

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

const CustomerListTable = (props) => {
  const { user } = useAuth();
  const {
    customers,
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
  }, [customers, pageSize]);

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

  const filteredCustomers = applyFilters(customers, query);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, limit);

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value='customers'
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
            placeholder={'customers'}
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
                  Name
                </TableCell>
                {user.role === 'ROOT' && (<TableCell>
                  Address
                </TableCell>)}
                <TableCell>
                  Account Balance
                </TableCell>
                <TableCell>
                  Cashback Balance
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((customer) => {
                return (
                  <TableRow
                    hover
                    key={customer.id}
                  >
                    <TableCell sx={{ minWidth: 225 }}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Avatar
                          src={customer.avatar}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        >
                          {getInitials(customer.name)}
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={'/dashboard/customers/' + customer.code}
                            variant="subtitle2"
                          >
                            {customer.name}
                          </Link>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                          >
                            {customer.code}
                          </Typography>
                          {user.role === 'ROOT' && (<Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {customer.email}
                          </Typography>)}
                          {user.role === 'ROOT' && (<Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {customer.mobileNumber}
                          </Typography>)}
                        </Box>
                      </Box>
                    </TableCell>
                    {user.role === 'ROOT' && (<TableCell sx={{ minWidth: 300 }}>
                      {customer.address}
                    </TableCell>)}
                    <TableCell sx={{ minWidth: 140 }}>
                      € {numeral(customer.accountBalance)
                      .format('0,0.00')}
                    </TableCell>
                    <TableCell sx={{ minWidth: 145 }}>
                      € {numeral(customer.cashbackBalance)
                      .format('0,0.00')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={'/dashboard/customers/' + customer.code + '/edit'}
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
        count={filteredCustomers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={pageSizeList}
      />
    </Card>
  );
};

CustomerListTable.propTypes = {
  customers: PropTypes.array.isRequired
};

export default CustomerListTable;
