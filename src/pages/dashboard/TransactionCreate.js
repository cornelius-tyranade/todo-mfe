import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { TransactionCreateForm } from '../../components/dashboard/transaction';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';
import useIsMountedRef from '../../hooks/useIsMountedRef';

const TransactionCreate = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [transaction, setTransaction] = useState({});
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCustomers = useCallback(async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_CUST_SELECT_ALL);

      if (isMountedRef.current) {
        setCustomers(response.data.result);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  const getItems = useCallback(async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_ITEM_SELECT_ALL);

      if (isMountedRef.current) {
        setItems(response.data.result);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getCustomers();
    getItems();
  }, [getCustomers, getItems]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Transaction Add | Laundry Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Transaction Add
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small"/>}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/transactions"
                  variant="subtitle2"
                >
                  Transactions
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Add
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box mt={3}>
            <TransactionCreateForm
              transaction={transaction}
              customers={customers}
              items={items}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionCreate;
