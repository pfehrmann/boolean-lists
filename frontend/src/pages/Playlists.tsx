import {Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List/List";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import * as logger from "winston";
import * as api from "../api";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Redirect} from "react-router";
import {PlaylistItem} from "../components/PlaylistItem";

class Landing extends React.Component {
    public state: {
        playlists: Array<{ name: string, description: string, graph: string, image?: {url: string} }>,
        open: boolean,
        deletePlaylist: string,
        redirect?: string,
        playlistItems: PlaylistItem[];
    };

    constructor(props: any) {
        super(props);

        this.state = {
            deletePlaylist: "",
            open: false,
            playlistItems: [],
            playlists: [],
        };

        this.updatePlaylists = this.updatePlaylists.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    public render() {
        if (this.state.redirect) {
            return (<Redirect to={this.state.redirect}/>);
        }

        return (
            <Grid container={true} justify={"center"} style={{marginTop: "2em"}}>
                <Grid item={true} md={6} sm={8} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary">
                                Your playlists
                            </Typography>
                            <List style={{maxWidth: "500px"}}>
                                {this.state.playlistItems}
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
    }

    public async componentDidMount() {
        if (sessionStorage.getItem("loggedIn") !== "true") {
            this.setState({
                redirect: "/login",
            });
        }

        this.updatePlaylists();
    }

    private async updatePlaylists() {
        try {
            const pageablePlaylists = await api
                .MeApiFp()
                .getMyPlaylists({credentials: "include"})();

            const playlists = await Promise.all(pageablePlaylists.playlists.map(async (playlist) => {
                if (playlist.uri) {
                    try {
                        const apiPlaylist = await api
                            .PlaylistApiFp()
                            .getPlaylistByUri(playlist.uri, {credentials: "include"})();
                        if (apiPlaylist.image) {
                            playlist.image = apiPlaylist.image;
                        }
                    } catch (error) {
                        if (error.status === 401) {
                            this.setState({
                                redirect: "/login",
                            });
                        }
                    }
                }
                return playlist;
            }));

            const playlistItems = playlists.map((playlist, index) => {
                return (
                    <div key={index}>
                        <PlaylistItem
                            playlist={playlist}
                            handleDelete={this.deletePlaylist(playlist.name)}
                        />
                        <Divider inset={true}/>
                    </div>
                );
            });

            this.setState({
                playlistItems,
                playlists,
            });
        } catch (error) {
            if (error.status === 401) {
                this.setState({
                    redirect: "/login",
                });
            }
        }
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
            await api
                .MeApiFp()
                .deleteMyPlaylistById(this.state.deletePlaylist, {credentials: "include"})();
            this.updatePlaylists();
        } catch (error) {
            logger.error(error.stack);
            if (error.status === 401) {
                this.setState({
                    redirect: "/login",
                });
            }
        }
        this.setState({
            open: false,
        });
    }
}

export default Landing;
