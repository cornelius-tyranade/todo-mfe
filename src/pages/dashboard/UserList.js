import {useCallback, useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import {Box, Breadcrumbs, Button, Container, Grid, Link, Typography} from '@material-ui/core';
import {UserListTable} from '../../components/dashboard/user';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import axios from 'axios';

const UserList = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_USR_SELECT_ALL);

      if (isMountedRef.current) {
        setUsers(response.data.result);
        setPageSize(response.data.pageSize);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Users | Laundry Admin</title>
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
                Users
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
                  List
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon fontSize="small"/>}
                  sx={{ m: 1 }}
                  variant="contained"
                  component={RouterLink}
                  to="/dashboard/users/new"
                >
                  Add User
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <UserListTable
              users={users}
              pageSize={pageSize}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserList;
