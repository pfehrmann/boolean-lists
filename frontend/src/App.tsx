import React, { useEffect, useState } from "react";
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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import Cookie from "js-cookie";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(Boolean(Cookie.get("logged_in")));
  const [menuVisible, setMenuVisible] = useState(false);

  const loginOut = async () => {
    if (sessionStorage.getItem("loggedIn") === "true") {
      sessionStorage.removeItem("loggedIn");
      window.location.assign(
        `${process.env.REACT_APP_API_BASE}/auth/spotify/logout`
      );
    } else {
      window.location.assign(`${process.env.REACT_APP_API_BASE}/auth/spotify`);
    }
  };

  useEffect(() => {
    setLoggedIn(
      Cookie.get("logged_in") === "true" ||
        sessionStorage.getItem("loggedIn") === "true"
    );
  });

  return (
    <BrowserRouter>
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
          <Toolbar sx={{ gap: 2 }}>
            {loggedIn && (
              <IconButton
                color="inherit"
                aria-label="Menu"
                onClick={() => setMenuVisible(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
              BooleanLists
            </Typography>
            <Button color="inherit" onClick={() => loginOut()}>
              {loggedIn ? "Logout" : "Login"}
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer open={menuVisible} onClose={() => setMenuVisible(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={() => setMenuVisible(false)}
            onKeyDown={() => setMenuVisible(false)}
          >
            <List>
              <DrawerLink to="/" icon={<HomeIcon />} text="Home" />
              <DrawerLink to="/editor" icon={<EditIcon />} text="Editor" />
              <Divider />
              <DrawerLink
                to="/playlists"
                icon={<SendIcon />}
                text="Playlists"
              />
            </List>
          </div>
        </Drawer>
        <div style={{ display: "flex", flexFlow: "column", flex: "1 1 auto" }}>
          <Routes>
            <Route path="/editor/:id?" element={<Editor />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
            <Route path="/login" element={<Landing />} />
            <Route path="/" element={<Landing />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

interface DrawerLinkProps {
  to: string;
  icon: React.ReactElement;
  text: string;
}

const DrawerLink = ({ to, icon, text }: DrawerLinkProps) => (
  <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
    <ListItem button>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  </Link>
);
