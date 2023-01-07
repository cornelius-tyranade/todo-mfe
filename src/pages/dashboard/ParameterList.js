import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { ParameterListTable } from '../../components/dashboard/parameter';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import axios from 'axios';

const ParameterList = (prop) => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [parameters, setParameters] = useState([]);
  const [pageSize, setPageSize] = useState(0);
  const [currentTab, setCurrentTab] = useState(prop.currentTab);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getParameters = useCallback(async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_PARAM_SELECT_ALL);

      if (isMountedRef.current) {
        setParameters(response.data.result);
        setPageSize(response.data.pageSize);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getParameters();
  }, [getParameters]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Parameters | Laundry Admin</title>
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
                Parameters
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small"/>}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/parameters"
                  variant="subtitle2"
                >
                  Parameters
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  List
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <ParameterListTable
              parameters={parameters}
              pageSize={pageSize}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ParameterList;
