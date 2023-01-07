import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Divider, Grid, Link, Tab, Tabs, Typography } from '@material-ui/core';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import PencilAltIcon from '../../icons/PencilAlt';
import gtm from '../../lib/gtm';
import axios from 'axios';
import useSettings from '../../hooks/useSettings';
import { TransactionDetailsForm, TransactionOrdersForm } from '../../components/dashboard/transaction';

const tabs = [
  {
    label: 'Details',
    value: 'details'
  }
];

const TransactionDetails = () => {
  const { code } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [transaction, setTransaction] = useState(null);
  const [currentTab, setCurrentTab] = useState('details');

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getTransaction = useCallback(async () => {
    try {
      const data = {
        code: code
      };
      const response = await axios.post(process.env.REACT_APP_TRXN_SELECT_BY_CD, data);

      if (isMountedRef.current) {
        setTransaction(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getTransaction();
  }, [getTransaction]);

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!transaction) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Transaction Details | Laundry Admin</title>
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
                {transaction.code}
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
                  Details
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  component={RouterLink}
                  startIcon={<PencilAltIcon fontSize="small"/>}
                  sx={{ m: 1 }}
                  to={'/dashboard/transactions/' + transaction.code + '/edit'}
                  variant="contained"
                >
                  Edit
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
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
          </Box>
          <Divider/>
          <Box sx={{ mt: 3 }}>
            {currentTab === 'details' && (
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  lg={settings.compact ? 6 : 4}
                  md={6}
                  xl={settings.compact ? 6 : 3}
                  xs={12}
                >
                  <TransactionDetailsForm
                    code={transaction.code}
                    customerCode={transaction.customerCode}
                    customerName={transaction.customerName}
                    totalAmount={transaction.totalAmount}
                    cashbackUsed={transaction.cashbackUsed}
                    cashbackGet={transaction.cashbackGet}
                    transactionStatus={transaction.transactionStatus}
                    createDate={transaction.createDate}
                    receiptNumber={transaction.receiptNumber}
                    endStateDate={transaction.endStateDate}
                    receiptUrl={transaction.receiptUrl}
                    receiptUrlExpiredDate={transaction.receiptUrlExpiredDate}
                  />
                </Grid>
                <Grid
                  item
                  lg={settings.compact ? 6 : 4}
                  md={6}
                  xl={settings.compact ? 6 : 3}
                  xs={12}
                >
                  <TransactionOrdersForm
                    details={transaction.details}
                    totalAmount={transaction.totalAmount}
                    cashbackUsed={transaction.cashbackUsed}
                    netTotalAmount={transaction.netTotalAmount}
                    cashbackGet={transaction.cashbackGet}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionDetails;
