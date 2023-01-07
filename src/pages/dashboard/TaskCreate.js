import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { TaskCreateForm } from '../../components/dashboard/task';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';

const TaskCreate = () => {
  const { settings } = useSettings();
  const [task, setTask] = useState({});

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Task Add | TODO Application</title>
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
            spacing={0}
          >
            <Grid task>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Task Add
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small"/>}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/tasks"
                  variant="subtitle2"
                >
                  Tasks
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
            <TaskCreateForm task={task} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TaskCreate;
