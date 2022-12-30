import { styled } from '@mui/system';
import React, { useState } from 'react';

import { NodeEditor } from '../components/NodeEditor';
import { Node } from '../types/Node';
import { NodeContent } from '../types/NodeContent';
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

const MyLibraryNode: NodeContent<
  Extract<ExampleNodes, 'MyLibrary'>,
  ExampleDataType
> = ({ node, className }) => {
  return <div className={className}>Hello My Library</div>;
};

const StyledMyLibraryNode = styled(MyLibraryNode)`
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.primary.light};
  border-radius: ${({ theme }) => theme.shape.borderRadius * 20}px;
`;

const AddNode: NodeContent<Extract<ExampleNodes, 'Add'>, ExampleDataType> = ({
  node,
}) => {
  return <div>Hello Add</div>;
};

const GenericNode: NodeContent<ExampleNodes, ExampleDataType> = ({ node }) => (
  <div>{node.type}</div>
);

const nodeTypes: { [T in ExampleNodes]: NodeContent<T, ExampleDataType> } = {
  Add: AddNode,
  MyLibrary: (props) => <StyledMyLibraryNode {...props} />,
  Album: GenericNode,
  ArtistTopTracks: GenericNode,
  FilterByAudioFeature: GenericNode,
  Limit: GenericNode,
  MyTopTracks: GenericNode,
  Playlist: GenericNode,
  Randomize: GenericNode,
  Subtract: GenericNode,
};
