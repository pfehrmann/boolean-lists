import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import {Link} from "react-router-dom";
import * as logger from "winston";
import * as User from "../api/User";

import Avatar from "@material-ui/core/Avatar/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {getPlaylist} from "../api/Playlist";

class Landing extends React.Component {
    public state: {
        playlists: Array<{ name: string, description: string, graph: string, image?: string }>,
        open: boolean,
        deletePlaylist: string,
    };

    constructor(props: any) {
        super(props);

        this.state = {
            deletePlaylist: "",
            open: false,
            playlists: [],
        };

        this.updatePlaylists = this.updatePlaylists.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public render() {
        /* tslint:disable */
        return (
            <Grid container={true} justify={"center"} style={{marginTop: "2em"}}>
                <Grid item={true} md={6} sm={8} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary">
                                Your playlists
                            </Typography>
                            <List style={{maxWidth: "500px"}}>
                                {
                                    this.state.playlists.map((playlist, index) => {
                                        return (
                                            <div key={index}>
                                                <ListItem>
                                                    <Avatar src={playlist.image}/>
                                                    <Link to={`/editor/${playlist.name}`}
                                                          style={{textDecoration: "none"}}>
                                                        <IconButton>
                                                            <EditIcon color={"action"}/>
                                                        </IconButton>
                                                    </Link>

                                                    <ListItemText primary={playlist.name}
                                                                  secondary={playlist.description}/>
                                                    <ListItemSecondaryAction>
                                                        <IconButton onClick={this.deletePlaylist(playlist.name)}>
                                                            <DeleteIcon color={"error"}/>
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                                <Divider inset={true}/>
                                            </div>
                                        );
                                    })
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Delete playlist?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Delete the playlist "{this.state.deletePlaylist}". This action cannot be undone, there will
                            be no way to recover your playlist.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDelete} color="secondary">
                            Delete
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus={true}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
        /* tslint:enable */
    }

    public async componentDidMount() {
        if (!(window as any).keycloak.authenticated) {
            await (window as any).keycloak.login();
        }
        this.updatePlaylists();
    }

    private async updatePlaylists() {
        let playlists: Array<{
            name: string,
            description: string,
            graph: string,
            uri?: string,
            image?: string,
        }> = await User.playlists();
        playlists = await Promise.all(playlists.map(async (playlist) => {
            if (playlist.uri) {
                const data = (await getPlaylist(playlist.uri)).data;
                playlist.image = data.image.url;
            }
            return playlist;
        }));
        this.setState({
            playlists,
        });
    }

    private deletePlaylist(playlistName: string): () => any {
        return async () => {
            this.setState({
                deletePlaylist: playlistName,
                open: true,
            });
        };
    }

    private handleClose() {
        this.setState({
            open: false,
        });
    }

    private async handleDelete() {
        try {
            await User.deletePlaylist(this.state.deletePlaylist);
            this.updatePlaylists();
        } catch (error) {
            logger.error(error.stack);
        }
        this.setState({
            open: false,
        });
    }
}

export default Landing;
