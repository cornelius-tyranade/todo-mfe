import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import { TaskListTable } from '../../components/dashboard/task';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import axios from 'axios';

const TaskList = (prop) => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [tasks, setTasks] = useState([]);
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getTasks = useCallback(async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_TASK_SELECT_ALL + "?currentPage=0&pageSize=100");

      if (isMountedRef.current) {
        setTasks(response.data.result);
        setPageSize(response.data.pageSize);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Tasks | TODO Application</title>
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
                Tasks
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
                  List
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid task>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon fontSize="small"/>}
                  sx={{ m: 1 }}
                  variant="contained"
                  component={RouterLink}
                  to="/dashboard/tasks/new"
                >
                  Add Task
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <TaskListTable
              tasks={tasks}
              pageSize={pageSize}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TaskList;
