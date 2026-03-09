import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/index';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';

// CSS imports (unchanged)
import "animate.css/animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "cropperjs/dist/cropper.css";
import "toastr/build/toastr.min.css";
import "react-data-table-component-extensions/dist/index.css";
import "driver.js/dist/driver.min.css";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

import './assets/vendors/iconic-fonts/flat-icons/flaticon.css';
import './assets/vendors/iconic-fonts/cryptocoins/cryptocoins.css';
import './assets/vendors/iconic-fonts/cryptocoins/cryptocoins-colors.css';
import './assets/vendors/iconic-fonts/font-awesome/css/all.min.css';
import './assets/css/style.css';

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('medboard')
);

reportWebVitals();
