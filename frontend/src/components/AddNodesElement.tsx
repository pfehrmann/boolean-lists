import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import * as _ from 'lodash';
import * as React from 'react';
import * as SRD from 'storm-react-diagrams';

import AddNodeModel from '../nodes/AddNode/AddNodeModel';
import AlbumNodeModel from '../nodes/AlbumNode/AlbumNodeModel';
import ArtistTopTracksNodeModel from '../nodes/ArtistTopTracksNode/ArtistTopTracksNodeModel';
import FilterByAudioFeatureNodeModel from '../nodes/FilterByAudioFeaturesNode/FilterByAudioFeatureNodeModel';
import LimitNodeModel from '../nodes/LimitNode/LimitNodeModel';
import MyLibraryNodeModel from '../nodes/MyLibraryNode/MyLibraryNodeModel';
import MyTopTracksNodeModel from '../nodes/MyTopTracksNode/MyTopTracksNodeModel';
import PlaylistNodeModel from '../nodes/PlaylistNode/PlaylistNodeModel';
import RandomizeNodeModel from '../nodes/RandomizeNode/RandomizeNodeModel';
import SubtractNodeModel from '../nodes/SubtractNode/SubtractNodeModel';

interface IAddNodesElementProps {
  engine: SRD.DiagramEngine;
  model: SRD.DiagramModel;
  className?: any;
  open: boolean;
  onClose: () => any;
}

interface IAddNodesElementState {
  lastMouseEvent: any;
}

export class AddNodesElement extends React.Component<IAddNodesElementProps> {
  public state: IAddNodesElementState;

  constructor(props: IAddNodesElementProps) {
    super(props);

    this.state = {
      lastMouseEvent: undefined,
    };

    this.addNode = this.addNode.bind(this);
  }

  public componentDidMount() {
    window.addEventListener('mousemove', (event) => {
      this.setState({
        lastMouseEvent: event,
      });
    });
  }

  public render() {
    return (
      <Dialog
        onClose={this.props.onClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
      >
        <DialogTitle id="simple-dialog-title">Save BooleanList</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a node to the graph</DialogContentText>
          <List>
            <ListItem
              button={true}
              onClick={this.addNode(PlaylistNodeModel.getInstance)}
            >
              <ListItemText>Add a PlaylistNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(AddNodeModel.getInstance)}
            >
              <ListItemText>Add an AddNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(SubtractNodeModel.getInstance)}
            >
              <ListItemText>Add a SubtractNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(LimitNodeModel.getInstance)}
            >
              <ListItemText>Add a LimitNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(RandomizeNodeModel.getInstance)}
            >
              <ListItemText>Add a RandomizeNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(MyTopTracksNodeModel.getInstance)}
            >
              <ListItemText>Add a MyTopTracksNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(AlbumNodeModel.getInstance)}
            >
              <ListItemText>Add a AlbumNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(ArtistTopTracksNodeModel.getInstance)}
            >
              <ListItemText>Add ArtistTopTracksNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(MyLibraryNodeModel.getInstance)}
            >
              <ListItemText>Add a MyLibraryNode</ListItemText>
            </ListItem>
            <ListItem
              button={true}
              onClick={this.addNode(FilterByAudioFeatureNodeModel.getInstance)}
            >
              <ListItemText>Add a FilterByAudioFeatureNode</ListItemText>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    );
  }

  public addNode(nodeFunction: () => SRD.NodeModel): () => any {
    return () => {
      this.props.onClose();
      const node = nodeFunction();
      (this.props.engine.getNodeFactory(node.getType()) as any).setConfigOpen(
        true,
      );
      const position = this.props.engine.getRelativeMousePoint(
        this.state.lastMouseEvent,
      );
      node.setPosition(position.x, position.y);

      this.props.model.addNode(node);
      this.props.model.clearSelection();
      node.setSelected(true);
      this.props.engine.repaintCanvas();

      _.delay(() => {
        (this.props.engine.getNodeFactory(node.getType()) as any).setConfigOpen(
          false,
        );
      }, 100);
    };
  }
}
