import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { UserEditForm } from '../../components/dashboard/user';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';

const UserEdit = () => {
  const { username } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [user, setUser] = useState(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getUser = useCallback(async () => {
    try {
      const data = {
        username: username
      };
      const response = await axios.post(process.env.REACT_APP_USR_SELECT_BY_CD, data);

      if (isMountedRef.current) {
        setUser(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: User Edit | Laundry Admin</title>
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
                User Edit
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small"/>}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/users"
                  variant="subtitle2"
                >
                  Users
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
            <UserEditForm user={user}/>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserEdit;
