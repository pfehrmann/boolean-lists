import * as React from "react";
import "./App.css";

import Editor from "./pages/Editor";
import Landing from "./pages/Landing";
import LoginSuccess from "./pages/LoginSuccess";
import Playlists from "./pages/Playlists";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {withStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import SendIcon from "@material-ui/icons/Send";

// @ts-ignore
import * as Cookie from "js-cookie";
import {BrowserRouter, Link, Route} from "react-router-dom";

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
        loggedIn: boolean,
        menuVisible: boolean,
    };

    constructor(props: any) {
        super(props);

        this.state = {
            loggedIn: Cookie.get("logged_in"),
            menuVisible: false,
        };

        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.loginOut = this.loginOut.bind(this);
        this.menuButton = this.menuButton.bind(this);
    }

    public render() {
        return (
            <BrowserRouter>
                <div style={{minHeight: "100vh", maxHeight: "100vh", display: "flex", flexFlow: "column"}}>
                    <AppBar position="static" elevation={0} style={{flex: "0 1 auto"}}>
                        <Toolbar />
                    </AppBar>
                    <AppBar position="fixed">
                        <Toolbar>
                            {this.menuButton()}
                            <Typography variant="title" color="inherit" className={this.props.classes.grow}>
                                BooleanLists
                            </Typography>
                            <Button
                                color="inherit"
                                onClick={this.loginOut}
                            >
                                {this.state.loggedIn ? "Logout" : "Login"}
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer open={this.state.menuVisible} onClose={this.toggleDrawer(false)}>
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
                                            <HomeIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Home"/>
                                    </ListItem>
                                </Link>
                                <Link to="/editor" style={{ textDecoration: "none" }}>
                                    <ListItem button={true}>
                                        <ListItemIcon>
                                            <EditIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Editor"/>
                                    </ListItem>
                                </Link>
                                <Divider/>
                                <Link to="/playlists" style={{ textDecoration: "none" }}>
                                    <ListItem button={true}>
                                        <ListItemIcon>
                                            <SendIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Playlists"/>
                                    </ListItem>
                                </Link>
                            </List>
                        </div>
                    </Drawer>
                    <div style={{display: "flex", flexFlow: "column", flex: "1 1 auto"}}>
                        <Route exact={true} path="/" component={Landing}/>
                        <Route path="/editor/:id?" component={Editor}/>
                        <Route path="/playlists" component={Playlists}/>
                        <Route path="/loginSuccess" component={LoginSuccess}/>
                    </div>
                </div>
            </BrowserRouter>
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
        if ((window as any).loggedIn) {
            window.location.assign(`${process.env.REACT_APP_API_BASE}/auth/spotify/logout`);
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
                    <MenuIcon/>
                </IconButton>
            );
        } else {
            return;
        }
    }
}

export default withStyles(styles)(App);
