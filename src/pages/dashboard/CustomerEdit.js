import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { CustomerEditForm } from '../../components/dashboard/customer';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';

const CustomerEdit = () => {
  const { code } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getCustomer = useCallback(async () => {
    try {
      const data = {
        code: code
      };
      const response = await axios.post(process.env.REACT_APP_CUST_SELECT_BY_CD, data);

      if (isMountedRef.current) {
        setCustomer(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  if (!customer) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Customer Edit | Laundry Admin</title>
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
                Customer Edit
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small"/>}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/customers"
                  variant="subtitle2"
                >
                  Customers
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
            <CustomerEditForm customer={customer}/>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomerEdit;
