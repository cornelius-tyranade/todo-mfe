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
  TextField, Typography
} from '@material-ui/core';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import Scrollbar from '../../Scrollbar';
import { format } from 'date-fns';
import Label from '../../Label';
import numeral from 'numeral';

const tabs = [
  {
    label: 'Transactions',
    value: 'transactions'
  }
];

const sortOptions = [
  {
    label: 'Create Date (Newest)',
    value: 'createDate|desc'
  },
  {
    label: 'Create Date (Oldest)',
    value: 'createDate|asc'
  },
  {
    label: 'Code (A-Z)',
    value: 'code|asc'
  },
  {
    label: 'Code (Z-A)',
    value: 'code|desc'
  }
];

const applyFilters = (transactions, query) => transactions
  .filter((transaction) => {
    let matches = true;

    if (query) {
      const properties = ['code', 'customerName', 'receiptNumber'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (transaction[property].toLowerCase()
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

const applyPagination = (transactions, page, limit) => transactions
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

const applySort = (transactions, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = transactions.map((el, index) => [el, index]);

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

const TransactionListTable = (props) => {
  const {
    transactions,
    pageSize,
    currentTab,
    setCurrentTab,
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
  }, [transactions, pageSize]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
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

  const filteredTransactions = applyFilters(transactions, query);
  const sortedTransactions = applySort(filteredTransactions, sort);
  const paginatedTransactions = applyPagination(sortedTransactions, page, limit);

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
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
            placeholder="Search transactions"
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
            code="sort"
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
                  Code
                </TableCell>
                <TableCell>
                  Customer Code
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  Net Total Amount
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  Cashback Used
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  Cashback Get
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  Create Date
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  Status
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => {
                return (
                  <TableRow
                    hover
                    key={transaction.id}
                  >
                    <TableCell>
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
                            to={'/dashboard/transactions/' + transaction.code}
                            variant="subtitle2"
                          >
                            {transaction.code}
                          </Link>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                          >
                            {transaction.receiptNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ ml: 1 }}>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={'/dashboard/customers/' + transaction.customerCode}
                          variant="subtitle2"
                        >
                          {transaction.customerName}
                        </Link>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                        >
                          {transaction.customerCode}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      € {numeral(transaction.netTotalAmount)
                      .format('0,0.00')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      € {numeral(transaction.cashbackUsed)
                      .format('0,0.00')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      € {numeral(transaction.cashbackGet)
                      .format('0,0.00')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      {format(new Date(transaction.createDate), 'dd-MM-yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Label color={transaction.transactionStatus === 'PAID' ? 'success' : transaction.transactionStatus === 'REJECTED' ? 'error' : 'primary'}>
                        {transaction.transactionStatus}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={'/dashboard/transactions/' + transaction.code + '/edit'}
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
        count={filteredTransactions.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={pageSizeList}
      />
    </Card>
  );
};

TransactionListTable.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default TransactionListTable;
