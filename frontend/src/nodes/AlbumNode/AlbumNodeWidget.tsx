import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import * as _ from "lodash";
import * as React from "react";
import * as SRD from "storm-react-diagrams";
import * as logger from "winston";
import * as Search from "../../api/Search";

import List from "@material-ui/core/List/List";
import {AlbumItem} from "../../components/AlbumItem";
import {AbstractNodeWidget, IAbstractNodeProps} from "../AbstractNodeWidget";
import AlbumNodeModel from "./AlbumNodeModel";

export interface IAlbumNodeProps extends IAbstractNodeProps<AlbumNodeModel> {
    node: AlbumNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

interface IAlbumNodeState {
    configOpen: boolean;
    albumItems: React.Component[],
    albumResults: any[];
    searchQuery: string;
}

export default class AlbumNodeWidget extends AbstractNodeWidget<IAlbumNodeProps> {
    private static stopPropagation(event: any) {
        event.stopPropagation();
    }

    public state: IAlbumNodeState;

    constructor(props: IAlbumNodeProps) {
        super("album-node", props);

        this.state = {
            albumItems: [],
            albumResults: [],
            configOpen: false,
            searchQuery: ""
        };

        this.render = this.render.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.updateSearchQuery = this.updateSearchQuery.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    public render() {
        return (<div>
            {super.render()}
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.configOpen}
                    onKeyUp={AlbumNodeWidget.stopPropagation} onDrag={AlbumNodeWidget.stopPropagation}
                    onScroll={AlbumNodeWidget.stopPropagation}>
                <DialogTitle id="simple-dialog-title">Search for an album</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Find an Album you like for this node.
                    </DialogContentText>
                    <TextField
                        autoFocus={true}
                        margin="dense"
                        id="query"
                        label="Album name"
                        type="search"
                        fullWidth={true}
                        value={this.state.searchQuery}
                        onChange={this.updateSearchQuery}
                        onKeyUp={_.throttle(this.handleKeypress, 250)}
                    />
                    <List style={{maxWidth: "300px"}}>
                    {this.state.albumItems}
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
        </div>)
    }

    public onDoubleClick() {
        logger.info("Clicked.");
        this.setState({
            configOpen: true
        });
    }

    private updateSearchQuery(evt: any) {
        this.setState({
            searchQuery: evt.target.value
        });
    }

    private async handleKeypress() {
        const albums = await Search.searchAlbum(this.state.searchQuery);
        const albumItems = albums.map((album: any) => <AlbumItem key={album.id}
                                                                 handleClose={this.handleSelect}
                                                                 album={...album}/>);

        this.setState({
            albumItems,
            albumResults: albums
        });
    }

    private handleSelect(album: any) {
        this.props.node.configuration.id = album.id;
        this.props.node.name = `Album '${album.name}'`;
        this.handleClose();
    }

    private handleClose() {
        this.setState({
            configOpen: false
        });
    }
}
