import React from "react";
import ReactDOM from "react-dom";

import './index.css';

import App from './components/App/App';
import reportWebVitals from "./reportWebVitals";
import initFacebookSDK from "./initFacebookSDK";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

<FontAwesomeIcon icon="fa-brands fa-facebook" />

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

initFacebookSDK().then(() => {
  renderApp();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
