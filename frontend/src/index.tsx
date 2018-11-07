import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as winston from "winston";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

winston.add(new winston.transports.Console());

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red,
    },
});

function touchHandler(event: any) {
    const touches = event.changedTouches;
    const first = touches[0];
    let type = "";
    switch (event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    const simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    // event.preventDefault();
}

async function initialize() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);

    ReactDOM.render(
            <MuiThemeProvider theme={theme}>
                <CssBaseline>
                <App/>
                </CssBaseline>
            </MuiThemeProvider>,
        document.getElementById("root") as HTMLElement,
    );
}

initialize();
registerServiceWorker();
