import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List/List';
import TextField from '@mui/material/TextField';
import * as _ from 'lodash';
import * as React from 'react';
import { Redirect } from 'src/components/Redirect';
import { logger } from 'src/utils/logger';
import * as SRD from 'storm-react-diagrams';

import * as api from '../../api';
import { ArtistItem } from '../../components/ArtistItem';
import { AbstractNodeWidget, IAbstractNodeProps } from '../AbstractNodeWidget';
import ArtistTopTracksNodeModel from './ArtistTopTracksNodeModel';

export interface IArtistTopTracksNodeProps
  extends IAbstractNodeProps<ArtistTopTracksNodeModel> {
  node: ArtistTopTracksNodeModel;
  diagramEngine: SRD.DiagramEngine;
}

interface IArtistTopTracksNodeState {
  configOpen: boolean;
  artistItems: React.Component[];
  artistResults: any[];
  searchQuery: string;
  redirect?: string;
}

export default class ArtistTopTracksNodeWidget extends AbstractNodeWidget<IArtistTopTracksNodeProps> {
  private static stopPropagation(event: any) {
    event.stopPropagation();
  }

  public state: IArtistTopTracksNodeState;

  constructor(props: IArtistTopTracksNodeProps) {
    super('artist-top-tracks-node', props);

    this.state = {
      artistItems: [],
      artistResults: [],
      configOpen: props.configOpen,
      searchQuery: '',
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
          onKeyUp={ArtistTopTracksNodeWidget.stopPropagation}
          onDrag={ArtistTopTracksNodeWidget.stopPropagation}
          onScroll={ArtistTopTracksNodeWidget.stopPropagation}
        >
          <DialogTitle id="simple-dialog-title">
            Search for an artist
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Find an artist you like for this node.
            </DialogContentText>
            <TextField
              autoFocus={true}
              margin="dense"
              id="query"
              label="Artist name"
              type="search"
              fullWidth={true}
              value={this.state.searchQuery}
              onChange={this.updateSearchQuery}
              onKeyUp={_.throttle(this.handleKeypress, 250)}
            />
            <List style={{ maxWidth: '300px' }}>
              {this.state.artistItems as any}
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
    logger.info('Clicked.');
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
      const pageableArtists = await api
        .SearchApiFp()
        .searchArtist(this.state.searchQuery, undefined, {
          credentials: 'include',
        })();
      const artistItems = pageableArtists.artists.map((artist: any) => (
        <ArtistItem
          key={artist.id}
          handleClose={this.handleSelect}
          artist={artist}
        />
      ));

      this.setState({
        artistItems,
        artistResults: pageableArtists.artists,
      });
    } catch (error) {
      if (error.status === 401) {
        this.setState({
          redirect: '/login',
        });
      }
    }
  }

  private handleSelect(artist: any) {
    this.props.node.configuration.id = artist.id;
    this.props.node.name = `Artist Top Tracks '${artist.name}'`;
    this.handleClose();
  }

  private handleClose() {
    this.setState({
      configOpen: false,
    });
  }
}
