import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://jobseeker-jqt2.onrender.com";

import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App.jsx';

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.jsx";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
