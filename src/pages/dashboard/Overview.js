import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box, Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid, Link,
  Typography
} from '@material-ui/core';
import {
  OverviewInbox,
  OverviewLatestTransactions,
  OverviewPrivateWallet,
  OverviewTotalBalance,
  OverviewTotalTransactions,
  OverviewWeeklyEarnings
} from '../../components/dashboard/overview';
import useSettings from '../../hooks/useSettings';
import ArrowRightIcon from '../../icons/ArrowRight';
import BriefcaseIcon from '../../icons/Briefcase';
import DownloadIcon from '../../icons/Download';
import ExternalLinkIcon from '../../icons/ExternalLink';
import InformationCircleIcon from '../../icons/InformationCircle';
import PlusIcon from '../../icons/Plus';
import UsersIcon from '../../icons/Users';
import gtm from '../../lib/gtm';
import useAuth from '../../hooks/useAuth';
import ChevronRightIcon from '../../icons/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';

const Overview = () => {
  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Overview | Laundry Admin</title>
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
            spacing={3}
          >
            <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<ChevronRightIcon fontSize="small" />}
                  sx={{ mt: 1 }}
                >
                  <Link
                    color="textPrimary"
                    component={RouterLink}
                    to="/dashboard"
                    variant="subtitle2"
                  >
                    General
                  </Link>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    Overview
                  </Typography>
                </Breadcrumbs>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Good Morning, {user.name}!
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Make sure you complete your unfinished task.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Overview;
