import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List/List';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import * as _ from 'lodash';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Node } from '../types/Node';
import { generateAddNode } from './nodes/AddNode';
import { generateMyLibraryNode } from './nodes/MyLibraryNode';
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
          <ListItemButton onClick={() => onAdd(generateNode('Playlist'))}>
            <ListItemText>Add a PlaylistNode</ListItemText>
          </ListItemButton>
          <ListItemButton
            onClick={() =>
              onAdd({ ...generateNode('Add'), ...generateAddNode() })
            }
          >
            <ListItemText>Add an AddNode</ListItemText>
          </ListItemButton>
          <ListItemButton onClick={() => onAdd(generateNode('Subtract'))}>
            <ListItemText>Add a SubtractNode</ListItemText>
          </ListItemButton>
          <ListItemButton onClick={() => onAdd(generateNode('Limit'))}>
            <ListItemText>Add a LimitNode</ListItemText>
          </ListItemButton>
          <ListItemButton onClick={() => onAdd(generateNode('Randomize'))}>
            <ListItemText>Add a RandomizeNode</ListItemText>
          </ListItemButton>
          <ListItemButton onClick={() => onAdd(generateNode('MyTopTracks'))}>
            <ListItemText>Add a MyTopTracksNode</ListItemText>
          </ListItemButton>
          <ListItemButton onClick={() => onAdd(generateNode('Album'))}>
            <ListItemText>Add a AlbumNode</ListItemText>
          </ListItemButton>
          <ListItemButton
            onClick={() => onAdd(generateNode('ArtistTopTracks'))}
          >
            <ListItemText>Add ArtistTopTracksNode</ListItemText>
          </ListItemButton>
          <ListItemButton
            onClick={() =>
              onAdd({
                ...generateNode('MyLibrary'),
                ...generateMyLibraryNode(),
              })
            }
          >
            <ListItemText>Add a MyLibraryNode</ListItemText>
          </ListItemButton>
          <ListItemButton
            onClick={() => onAdd(generateNode('FilterByAudioFeature'))}
          >
            <ListItemText>Add a FilterByAudioFeatureNode</ListItemText>
          </ListItemButton>
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
