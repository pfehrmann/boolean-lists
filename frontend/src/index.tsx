import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as winston from 'winston';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

winston.add(new winston.transports.Console());

ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
