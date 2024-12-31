import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------
import { createRoot } from 'react-dom/client';
import { AppContext } from './hooks';
import { StrictMode } from 'react';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <StrictMode>
        <AppContext>
          <App />
        </AppContext>
      </StrictMode>
    </BrowserRouter>
  </HelmetProvider>
);
// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
