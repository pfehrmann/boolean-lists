import { Button } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Node as NodeType } from '../types/Node';
import { NodeContent } from '../types/NodeContent';
import { NodeEditor } from './NodeEditor';

type ExampleNodes = 'MyLibrary' | 'Add';
type ExampleDataType = 'songs';

export const Example = () => {
  const [nodes, setNodes] = useState<NodeType<ExampleNodes, ExampleDataType>[]>(
    [],
  );

  const handleAdd = () => {
    setNodes((prev) => {
      return [
        ...prev,
        {
          id: uuidv4(),
          type: 'MyLibrary',
          inputs: [],
          outputs: [],
          position: { x: 0, y: 0 },
        },
      ];
    });
  };

  return (
    <Root>
      <NodeEditor
        nodes={nodes}
        onChange={(nodes) => console.log(nodes)}
        nodeTypes={nodeTypes}
      />
      <AddButton onClick={handleAdd}>Add</AddButton>
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

const AddButton = styled(Button)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(1)};
  right: ${({ theme }) => theme.spacing(1)};
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
  return <div>Hello My Library</div>;
};

const nodeTypes: { [T in ExampleNodes]: NodeContent<T, ExampleDataType> } = {
  Add: AddNode,
  MyLibrary: (props) => <StyledMyLibraryNode {...props} />,
};
