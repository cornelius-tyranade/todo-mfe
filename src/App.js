import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';
import './i18n';
import GlobalStyles from './components/GlobalStyles';
import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { gtmConfig } from './config';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import gtm from './lib/gtm';
import routes from './routes';
import { createTheme } from './theme';
import { THEMES } from './constants';

const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  useScrollReset();

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: THEMES.DARK
  });

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={settings.direction}>
        <SnackbarProvider
          dense
          maxSnack={3}
        >
          <GlobalStyles />
          {auth.isInitialized ? content : <SplashScreen />}
        </SnackbarProvider>
      </RTL>
    </ThemeProvider>
  );
};

export default App;
