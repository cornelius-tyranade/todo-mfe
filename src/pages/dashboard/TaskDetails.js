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
import { TaskDetailsForm } from '../../components/dashboard/task';

const tabs = [
  {
    label: 'Details',
    value: 'details'
  }
];

const TaskDetails = () => {
  const { id } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [task, setTask] = useState(null);
  const [currentTab, setCurrentTab] = useState('details');

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

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  if (!task) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Task Details | TODO Application</title>
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
                {task.id}
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
                  Details
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid task>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  component={RouterLink}
                  startIcon={<PencilAltIcon fontSize="small"/>}
                  sx={{ m: 1 }}
                  to={'/dashboard/tasks/' + task.id + '/edit'}
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
                spacing={0}
              >
                <Grid
                  task
                  lg={settings.compact ? 6 : 4}
                  md={6}
                  xl={settings.compact ? 6 : 3}
                  xs={12}
                >
                  <TaskDetailsForm
                    id={task.id}
                    description={task.description}
                    status={task.status}
                    createDate={task.createDate}
                    updateDate={task.updateDate}
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

export default TaskDetails;
