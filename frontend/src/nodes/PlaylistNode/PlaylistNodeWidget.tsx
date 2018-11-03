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
import * as SRD from "storm-react-diagrams";
import * as logger from "winston";
import * as api from "../../api";

import {PlaylistItem} from "../../components/PlaylistItem";
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
        logger.info("Clicked.");
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
        const pageablePlaylists = await api.SearchApiFp((window as any).config)
            .searchPlaylist(this.state.searchQuery)();
        const playlistItems = pageablePlaylists.playlists.map((playlist: any) => (
            <PlaylistItem
                key={playlist.id}
                handleClose={this.handleSelect}
                playlist={...playlist}
            />
        ));

        this.setState({
            playlistItems,
            playlistResults: pageablePlaylists.playlists,
        });
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
