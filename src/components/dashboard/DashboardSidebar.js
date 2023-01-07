import {useEffect} from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Avatar, Box, Divider, Drawer, Hidden, Typography} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import CogIcon from '../../icons/Cog';
import getInitials from '../../utils/getInitials';

const sections = [
  {
    title: 'General',
    items: [
      {
        title: 'Overview',
        path: '/dashboard',
        icon: <ChartSquareBarIcon fontSize="small"/>
      }
    ]
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Tasks',
        path: '/dashboard/tasks',
        icon: <CogIcon fontSize="small"/>
      }
    ]
  }
];

const DashboardSidebar = (props) => {
  const {
    onMobileClose,
    openMobile
  } = props;
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <RouterLink to="/dashboard" style={{ textDecoration: 'none' }}>
              <Avatar
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {user.name}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {user.role === 'ADMIN' ? 'Administrator' : 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider/>
        <Box sx={{ p: 2 }}>
          {user.role === 'ADMIN' &&
              sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
        <Divider/>
        <Box sx={{
          p: 2
        }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            Version
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            1.0.0
          </Typography>
        </Box>
      </Scrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              width: 280
            }
          }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              height: 'calc(100% - 64px) !important',
              top: '64px !Important',
              width: 280
            }
          }}
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;
