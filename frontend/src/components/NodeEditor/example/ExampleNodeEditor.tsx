import { Box } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';

import { Container } from '../components/Node/Container';
import { NodeEditor } from '../components/NodeEditor';
import { Node } from '../types/Node';
import { NodeOverrides } from '../types/NodeContent';
import { EditorSpeedDial } from './EditorSpeedStyle';
import { ExampleDataType, ExampleNodes } from './types';

export const Example = () => {
  const [nodes, setNodes] = useState<Node<ExampleNodes, ExampleDataType>[]>([]);

  const addNode = (node: Node<ExampleNodes, ExampleDataType>) => {
    setNodes((prev) => [...prev, node]);
  };

  return (
    <Root>
      <NodeEditor
        nodes={nodes}
        onChange={(nodes) => console.log(nodes)}
        nodeTypes={nodeTypes}
      />
      <EditorSpeedDial onAdd={addNode} />
    </Root>
  );
};

const Root = styled('div')`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  position: relative;
  display: flex;
`;

const BasicNode = styled(Container)`
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.primary.light};
  border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
`;

const AddNode: NodeOverrides<Extract<ExampleNodes, 'Add'>, ExampleDataType> = {
  container: BasicNode,
  header: () => <Box sx={{ gridArea: 'header' }}>Add Node</Box>,
};

const GenericNode: NodeOverrides<ExampleNodes, ExampleDataType> = {
  container: BasicNode,
  header: ({ node }) => <Box sx={{ gridArea: 'header' }}>{node.type}</Box>,
};

const MyLibraryNode: NodeOverrides<
  Extract<ExampleNodes, 'MyLibrary'>,
  ExampleDataType
> = { ...GenericNode };

const nodeTypes: { [T in ExampleNodes]: NodeOverrides<T, ExampleDataType> } = {
  Add: AddNode,
  MyLibrary: MyLibraryNode,
  Album: GenericNode,
  ArtistTopTracks: GenericNode,
  FilterByAudioFeature: GenericNode,
  Limit: GenericNode,
  MyTopTracks: GenericNode,
  Playlist: GenericNode,
  Randomize: GenericNode,
  Subtract: GenericNode,
};
