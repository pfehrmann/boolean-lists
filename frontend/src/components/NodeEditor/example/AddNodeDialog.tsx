import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import * as _ from 'lodash';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Node } from '../types/Node';
import { ExampleDataType, ExampleNodes } from './types';

export interface AddNodeDialogProps {
  onAdd: (node: Node<ExampleNodes, ExampleDataType>) => void;
  open: boolean;
  onClose?: () => void;
}

export const AddNodeDialog = ({ onAdd, open, onClose }: AddNodeDialogProps) => {
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Save BooleanList</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a node to the graph</DialogContentText>
        <List>
          <ListItem button onClick={() => onAdd(generateNode('Playlist'))}>
            <ListItemText>Add a PlaylistNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('Add'))}>
            <ListItemText>Add an AddNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('Subtract'))}>
            <ListItemText>Add a SubtractNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('Limit'))}>
            <ListItemText>Add a LimitNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('Randomize'))}>
            <ListItemText>Add a RandomizeNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('MyTopTracks'))}>
            <ListItemText>Add a MyTopTracksNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('Album'))}>
            <ListItemText>Add a AlbumNode</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => onAdd(generateNode('ArtistTopTracks'))}
          >
            <ListItemText>Add ArtistTopTracksNode</ListItemText>
          </ListItem>
          <ListItem button onClick={() => onAdd(generateNode('MyLibrary'))}>
            <ListItemText>Add a MyLibraryNode</ListItemText>
          </ListItem>
          <ListItem
            button
            onClick={() => onAdd(generateNode('FilterByAudioFeature'))}
          >
            <ListItemText>Add a FilterByAudioFeatureNode</ListItemText>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

function generateNode(type: ExampleNodes) {
  return {
    id: uuidv4(),
    type,
    inputs: [],
    outputs: [],
    position: { x: 0, y: 0 },
  };
}
