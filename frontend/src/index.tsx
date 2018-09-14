import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as Keycloak from "keycloak-js";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as winston from 'winston';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

winston.add(new winston.transports.Console());

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red,
    },
});


async function initialize() {
    const keycloak = Keycloak("/keycloak.json");
    (window as any).keycloak = keycloak;

    await keycloak.init({onLoad: 'check-sso'});
    if (keycloak.authenticated) {
        setInterval(() => {
            keycloak.updateToken(10);
        }, 10000);
    }

    ReactDOM.render(
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <App/>
            </MuiThemeProvider>,
        document.getElementById('root') as HTMLElement
    );
}

initialize();
registerServiceWorker();
