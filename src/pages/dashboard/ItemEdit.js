import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Container, Grid, Link, Typography } from '@material-ui/core';
import { ItemEditForm } from '../../components/dashboard/item';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import axios from 'axios';

const ItemEdit = () => {
  const { code } = useParams();
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [item, setItem] = useState(null);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getItem = useCallback(async () => {
    try {
      const data = {
        code: code
      };
      const response = await axios.post(process.env.REACT_APP_ITEM_SELECT_BY_CD, data);

      if (isMountedRef.current) {
        setItem(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);


  useEffect(() => {
    getItem();
  }, [getItem]);

  if (!item) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Item Edit | Laundry Admin</title>
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
                Item Edit
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small"/>}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard/items"
                  variant="subtitle2"
                >
                  Items
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
            <ItemEditForm item={item} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ItemEdit;
