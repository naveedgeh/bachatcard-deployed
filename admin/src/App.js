import React from 'react';
// routes
import Router from './routes';
// theme, Mui
import ThemeProvider from './theme';
import { IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// components
import ScrollToTop from './components/ScrollToTop';
//libs
import { SnackbarProvider } from 'notistack';
//styles
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'src/assets/css/style.css';
// scrollbar-styles
import 'simplebar/src/simplebar.css';
// ----------------------------------------------------------------------

export default function App() {
  const notiStackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notiStackRef.current.closeSnackbar(key);
  };
  return (
    <ThemeProvider>
      <ScrollToTop />
      <SnackbarProvider
        hideIconVariant
        ref={notiStackRef}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        TransitionComponent={Slide}
        maxSnack={3}
        autoHideDuration={2000}
        action={(key) => (
          <IconButton onClick={onClickDismiss(key)}>
            <CloseIcon htmlColor='white' />
          </IconButton>
        )}
      >
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
