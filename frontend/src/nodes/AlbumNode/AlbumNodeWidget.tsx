import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as _ from "lodash";
import * as React from "react";
import * as SRD from "storm-react-diagrams";
import * as api from "../../api";

import List from "@mui/material/List/List";
import { AlbumItem } from "../../components/AlbumItem";
import { AbstractNodeWidget, IAbstractNodeProps } from "../AbstractNodeWidget";
import AlbumNodeModel from "./AlbumNodeModel";
import { Redirect } from "src/components/Redirect";
import { logger } from "src/utils/logger";

export interface IAlbumNodeProps extends IAbstractNodeProps<AlbumNodeModel> {
  node: AlbumNodeModel;
  diagramEngine: SRD.DiagramEngine;
}

interface IAlbumNodeState {
  configOpen: boolean;
  albumItems: React.Component[];
  albumResults: any[];
  searchQuery: string;
  redirect?: string;
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
      configOpen: props.configOpen,
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
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div>
        {super.render()}
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          open={this.state.configOpen}
          onKeyUp={AlbumNodeWidget.stopPropagation}
          onDrag={AlbumNodeWidget.stopPropagation}
          onScroll={AlbumNodeWidget.stopPropagation}
        >
          <DialogTitle id="simple-dialog-title">
            Search for an album
          </DialogTitle>
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
            <List style={{ maxWidth: "300px" }}>
              {this.state.albumItems as any}
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
    try {
      const pageableAlbums = await api
        .SearchApiFp()
        .searchAlbum(this.state.searchQuery, undefined, {
          credentials: "include",
        })();
      const albumItems = pageableAlbums.albums.map((album: any) => (
        <AlbumItem
          key={album.id}
          handleClose={this.handleSelect}
          album={album}
        />
      ));

      this.setState({
        albumItems,
        albumResults: pageableAlbums.albums,
      });
    } catch (error) {
      if (error.status === 401) {
        this.setState({
          redirect: "/login",
        });
      }
    }
  }

  private handleSelect(album: any) {
    this.props.node.configuration.id = album.id;
    this.props.node.name = `Album '${album.name}'`;
    this.handleClose();
  }

  private handleClose() {
    this.setState({
      configOpen: false,
    });
  }
}
