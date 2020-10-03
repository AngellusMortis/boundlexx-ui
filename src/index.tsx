import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { setTheme } from './themes';
import * as serviceWorker from './serviceWorker';
import { Fabric } from '@fluentui/react';

setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener("change", (e) => {
  setTheme(e.matches);
});

ReactDOM.render(
  <Fabric>
    <App />
  </Fabric>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
