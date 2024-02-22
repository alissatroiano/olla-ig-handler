import React from "react";
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './components/App/App';
import initFacebookSDK from "./initFacebookSDK";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App tab="home" />);


initFacebookSDK().then(() => {
  // Call the function to render the app after initializing the Facebook SDK
  root.render(<App tab="home" />);
});
