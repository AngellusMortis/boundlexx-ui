import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import * as serviceWorker from './serviceWorker';
import { Fabric } from '@fluentui/react';
import { darkTheme } from './themes';

const App = React.lazy(() => import('./App'));

const renderLoader = () => (
  <div style={{ textAlign: "center" }}>
    <img src="https://cdn.boundlexx.app/logos/logo.svg" alt="logo" width="300" height="300" className="logo" />
    <h1 style={{ color: darkTheme.palette.black }}>Boundlexx</h1>
  </div>
)

document.documentElement.style.background = darkTheme.palette.white;
ReactDOM.render(
  <React.Suspense fallback={renderLoader()}>
    <Fabric>
      <App />
    </Fabric>
  </React.Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
