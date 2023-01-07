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
  TextField
} from '@material-ui/core';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import Scrollbar from '../../Scrollbar';

const tabs = [
  {
    label: 'Parameters',
    value: 'parameters'
  }
];

const sortOptions = [
  {
    label: 'Code (A-Z)',
    value: 'code|asc'
  },
  {
    label: 'Code (Z-A)',
    value: 'code|desc'
  }
];

const applyFilters = (parameters, query) => parameters
  .filter((parameter) => {
    let matches = true;

    if (query) {
      const properties = ['code', 'dscp'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (parameter[property].toLowerCase()
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

const applyPagination = (parameters, page, limit) => parameters
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

const applySort = (parameters, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = parameters.map((el, index) => [el, index]);

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

const ParameterListTable = (props) => {
  const {
    parameters,
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
  }, [parameters, pageSize]);

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

  const filteredParameters = applyFilters(parameters, query);
  const sortedParameters = applySort(filteredParameters, sort);
  const paginatedParameters = applyPagination(sortedParameters, page, limit);

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
            placeholder="Search parameters"
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
                  Description
                </TableCell>
                <TableCell>
                  Value
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedParameters.map((parameter) => {
                return (
                  <TableRow
                    hover
                    key={parameter.id}
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
                            to={'/dashboard/parameters/' + parameter.code}
                            variant="subtitle2"
                          >
                            {parameter.code}
                          </Link>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {parameter.dscp}
                    </TableCell>
                    <TableCell>
                      {parameter.value}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={'/dashboard/parameters/' + parameter.code + '/edit'}
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
        count={filteredParameters.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={pageSizeList}
      />
    </Card>
  );
};

ParameterListTable.propTypes = {
  parameters: PropTypes.array.isRequired
};

export default ParameterListTable;
