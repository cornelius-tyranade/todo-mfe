import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { TransactionEditForm } from '../../components/dashboard/transaction';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';

const TransactionEdit = () => {
  const { code } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [transaction, setTransaction] = useState(null);

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

  if (!transaction) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Transaction Edit | Laundry Admin</title>
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
                Transaction Edit
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
                  Edit
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box mt={3}>
            <TransactionEditForm transaction={transaction}/>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionEdit;
