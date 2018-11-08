import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import * as _ from "lodash";
import * as React from "react";
import {Redirect} from "react-router";
import * as SRD from "storm-react-diagrams";
import * as api from "../../api";

import {SearchPlaylistItem} from "../../components/SearchPlaylistItem";
import {AbstractNodeWidget, IAbstractNodeProps} from "../AbstractNodeWidget";
import PlaylistNodeModel from "./PlaylistNodeModel";

export interface IPlaylistNodeProps extends IAbstractNodeProps<PlaylistNodeModel> {
    node: PlaylistNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

interface IPlaylistNodeState {
    configOpen: boolean;
    playlistItems: React.Component[];
    playlistResults: any[];
    searchQuery: string;
    redirect?: string;
}

export default class PlaylistNodeWidget extends AbstractNodeWidget<IPlaylistNodeProps> {
    private static stopPropagation(event: any) {
        event.stopPropagation();
    }

    public state: IPlaylistNodeState;

    constructor(props: IPlaylistNodeProps) {
        super("playlist-node", props);

        this.state = {
            configOpen: false,
            playlistItems: [],
            playlistResults: [],
            searchQuery: "",
        };

        this.render = this.render.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    public render() {
        if (this.state.redirect) {
            return (<Redirect to={this.state.redirect}/>);
        }

        return (
            <div>
                {super.render()}
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="simple-dialog-title"
                    open={this.state.configOpen}
                    onKeyUp={PlaylistNodeWidget.stopPropagation}
                    onDrag={PlaylistNodeWidget.stopPropagation}
                    onScroll={PlaylistNodeWidget.stopPropagation}
                >
                    <DialogTitle id="simple-dialog-title">Search for a playlist</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Find a Spotify playlist you like for this node.
                        </DialogContentText>
                        <TextField
                            autoFocus={true}
                            margin="dense"
                            id="query"
                            label="Playlist name"
                            type="search"
                            fullWidth={true}
                            value={this.state.searchQuery}
                            onChange={this.updateSearchQuery}
                            onKeyUp={_.throttle(this.handleKeypress, 250)}
                        />
                        <List style={{maxWidth: "300px"}}>
                            {this.state.playlistItems}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    public onDoubleClick() {
        this.setState({
            configOpen: true,
        });
    }

    private updateSearchQuery(evt: any) {
        this.setState({
            searchQuery: evt.target.value,
        });
    }

    private async handleKeypress() {
        try {
            const pageablePlaylists = await api.SearchApiFp()
                .searchPlaylist(this.state.searchQuery, undefined, {credentials: "include"})();
            const playlistItems = pageablePlaylists.playlists.map((playlist: any) => (
                <SearchPlaylistItem
                    key={playlist.id}
                    handleClose={this.handleSelect}
                    playlist={...playlist}
                />
            ));

            this.setState({
                playlistItems,
                playlistResults: pageablePlaylists.playlists,
            });
        } catch (error) {
            if (error.status === 401) {
                this.setState({
                    redirect: "/login",
                });
            }
        }
    }

    private handleSelect(playlist: any) {
        this.props.node.configuration.id = playlist.id;
        this.props.node.configuration.userId = playlist.userId;
        this.props.node.name = `Playlist '${playlist.name}'`;
        this.handleClose();
    }

    private handleClose() {
        this.setState({
            configOpen: false,
        });
    }
}
