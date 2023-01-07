import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { TaskEditForm } from '../../components/dashboard/task';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';

const TaskEdit = () => {
  const { id } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [task, setTask] = useState(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getTask = useCallback(async () => {
    try {
      const data = {
        id: id
      };
      const response = await axios.post(process.env.REACT_APP_TASK_SELECT_BY_ID, data);

      if (isMountedRef.current) {
        setTask(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);


  useEffect(() => {
    getTask();
  }, [getTask]);

  if (!task) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Task Edit | TODO Application</title>
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
                Task Edit
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
                  Edit
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box mt={3}>
            <TaskEditForm task={task} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TaskEdit;
