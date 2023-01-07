import {Box, Card, CardHeader, Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import useIsMountedRef from '../../hooks/useIsMountedRef';

const PriceListDisplay = () => {
  const isMountedRef = useIsMountedRef();
  const [categoriesState, setCategoriesState] = useState([]);
  const [itemsState, setItemsState] = useState([]);

  const getCategoriesAndItems = useCallback(async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_ITEM_DISPLAY_ALL);

      if (isMountedRef.current) {
        setCategoriesState(response.data.categories);
        setItemsState(response.data.items);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setCategoriesState, setItemsState, isMountedRef]);

  useEffect(() => {
    getCategoriesAndItems();
  }, [getCategoriesAndItems]);

  return (
    <>
      {categoriesState.map((category) => (
        <Box mb={3} key={category.code}>
          <Card>
            <CardHeader title={category.dscp}/>
            <Table>
              <TableBody>
                {itemsState.filter((item) => (
                  item.categoryCode === category.code
                ))
                  .map((item) => (
                    <TableRow
                      key={item.code}
                      sx={{
                        '&:last-child td': {
                          border: 0
                        }
                      }}
                    >
                      <TableCell>
                        <div>
                          <Typography
                            color="textPrimary"
                            variant="subtitle2"
                          >
                            {item.dscp}
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default PriceListDisplay;
