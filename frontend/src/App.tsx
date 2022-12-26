import * as React from "react";
import "./App.css";

import Editor from "./pages/Editor";
import { Landing } from "./pages/Landing";
import LoginSuccess from "./pages/LoginSuccess";
import { Playlists } from "./pages/Playlists";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { withStyles } from "@mui/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import Cookie from "js-cookie";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

const styles = {
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  root: {
    flexGrow: 1,
  },
};

class App extends React.Component<{ classes: any }> {
  public state: {
    loggedIn: boolean;
    menuVisible: boolean;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      loggedIn: Boolean(Cookie.get("logged_in")),
      menuVisible: false,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.loginOut = this.loginOut.bind(this);
    this.menuButton = this.menuButton.bind(this);
  }

  public componentDidMount() {
    this.setState({
      loggedIn:
        Cookie.get("logged_in") === "true" ||
        sessionStorage.getItem("loggedIn") === "true",
    });
  }

  public render() {
    return (
      <div
        style={{
          minHeight: "100vh",
          maxHeight: "100vh",
          display: "flex",
          flexFlow: "column",
        }}
      >
        <AppBar position="static" elevation={0} style={{ flex: "0 1 auto" }}>
          <Toolbar />
        </AppBar>
        <AppBar position="fixed">
          <Toolbar>
            {this.menuButton()}
            <Typography
              variant="h6"
              color="inherit"
              className={this.props.classes.grow}
            >
              BooleanLists
            </Typography>
            <Button color="inherit" onClick={this.loginOut}>
              {this.state.loggedIn ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          open={this.state.menuVisible}
          onClose={this.toggleDrawer(false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            <List>
              <Link to="/" style={{ textDecoration: "none" }}>
                <ListItem button={true}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>
              <Link to="/editor" style={{ textDecoration: "none" }}>
                <ListItem button={true}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Editor" />
                </ListItem>
              </Link>
              <Divider />
              <Link to="/playlists" style={{ textDecoration: "none" }}>
                <ListItem button={true}>
                  <ListItemIcon>
                    <SendIcon />
                  </ListItemIcon>
                  <ListItemText primary="Playlists" />
                </ListItem>
              </Link>
            </List>
          </div>
        </Drawer>
        <div style={{ display: "flex", flexFlow: "column", flex: "1 1 auto" }}>
          <BrowserRouter>
            <Routes>
              <Route path="/editor/:id?" element={<Editor />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/loginSuccess" element={<LoginSuccess />} />
              <Route path="/login" element={<Landing />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    );
  }

  private toggleDrawer(open: boolean) {
    return () => {
      this.setState({
        menuVisible: open,
      });
    };
  }

  private async loginOut() {
    if (sessionStorage.getItem("loggedIn") === "true") {
      sessionStorage.removeItem("loggedIn");
      window.location.assign(
        `${process.env.REACT_APP_API_BASE}/auth/spotify/logout`
      );
    } else {
      window.location.assign(`${process.env.REACT_APP_API_BASE}/auth/spotify`);
    }
  }

  private menuButton() {
    if (this.state.loggedIn) {
      return (
        <IconButton
          className={this.props.classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={this.toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      );
    } else {
      return;
    }
  }
}

export default withStyles(styles)(App);
