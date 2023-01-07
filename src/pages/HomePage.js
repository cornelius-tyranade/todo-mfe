import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@material-ui/core';
import gtm from '../lib/gtm';

const HomePage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Home Page | TODO Application</title>
      </Helmet>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            lg: 'repeat(3, 1fr)',
            xs: 'repeat(1, 1fr)'
          },
          minHeight: '100%',
          textAlign: {
            xs: 'center',
            md: 'left'
          }
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            pt: {
              xs: 0,
              md: 8
            },
            pb: {
              xs: 1,
              md: 8
            }
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              pl: {
                lg: 15
              }
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                py: 3
              }}
            >
              <img
                alt="logoipsum1"
                src="/static/custom/todo_logo_color.png"
                style={{ maxWidth: '20%' }}
              />
              <Typography
                color="textPrimary"
                variant="h5"
                style={{ marginLeft: '5px' }}
              >
                TODO Application
              </Typography>
            </Box>
            <Typography
              color="textPrimary"
              sx={{ fontWeight: 'fontWeightBold' }}
              variant="h3"
            >
              GET YOUR WORK DONE!
            </Typography>
            <Typography
              color="textPrimary"
              sx={{ paddingTop: 3 }}
              variant="body1"
            >
                Simple TODO Application with User Authentication.
            </Typography>
              <br />
            <Typography
              color="textPrimary"
              sx={{ paddingBottom: 3 }}
              variant="body1"
            >
              For more information, kindly contact cornelius.works@gmail.com
            </Typography>
          </Container>
        </Box>
      <Box
          sx={{
              backgroundColor: 'background.default',
              gridColumnStart: 2,
              gridColumnEnd: 4,
              pt: {
                  xs: 0,
                  md: 8
              },
              pb: {
                  xs: 1,
                  md: 8
              },
              backgroundImage: 'url(https://images.unsplash.com/photo-1589987607627-616cac5c2c5a)',
              backgroundSize: 'cover'
          }}
      >
      </Box>
      </Box>
    </>
  );
};

export default HomePage;
