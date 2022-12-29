import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { blue, red } from "@mui/material/colors";

const theme = createTheme({
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
    case "touchstart":
      type = "mousedown";
      break;
    case "touchmove":
      type = "mousemove";
      break;
    case "touchend":
      type = "mouseup";
      break;
    default:
      return;
  }

  const simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(
    type,
    true,
    true,
    window,
    1,
    first.screenX,
    first.screenY,
    first.clientX,
    first.clientY,
    false,
    false,
    false,
    false,
    0 /*left*/,
    null
  );

  first.target.dispatchEvent(simulatedEvent);
  // event.preventDefault();
}

async function initialize() {
  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);

  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </ThemeProvider>
  );
}

initialize();
registerServiceWorker();
