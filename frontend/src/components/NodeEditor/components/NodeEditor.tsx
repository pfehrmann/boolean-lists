import { styled } from '@mui/material';
import React, { useState } from 'react';

import { Node as NodeType } from '../types/Node';
import { NodeContent } from '../types/NodeContent';
import { DragContextProvider, DragRoot } from './DragRoot';
import { Node } from './Node';

export interface NodeEditorProps<
  NodeTypes extends string = string,
  DataType extends string = string,
> {
  nodes: NodeType<NodeTypes, DataType>[];
  onChange?: (updatedNodes: NodeType<NodeTypes, DataType>[]) => void;
  nodeTypes: Record<NodeTypes, NodeContent<NodeTypes, DataType>>;
}

export const NodeEditor = <
  NodeTypes extends string = string,
  DataType extends string = string,
>({
  nodes,
  nodeTypes,
}: NodeEditorProps<NodeTypes, DataType>) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const onMove = (movementX: number, movementY: number) => {
    console.log('moving editor');
    setOffset((prev) => ({ x: prev.x + movementX, y: prev.y + movementY }));
  };

  return (
    <DragContextProvider>
      <DragRoot defaultOnMove={onMove}>
        <RealtiveRoot style={{ left: `${offset.x}px`, top: `${offset.y}px` }}>
          {nodes.map((node) => (
            <Node<NodeTypes, DataType>
              key={node.id}
              node={node}
              nodeTypes={nodeTypes}
            />
          ))}
        </RealtiveRoot>
      </DragRoot>
    </DragContextProvider>
  );
};

const RealtiveRoot = styled('div')`
  position: relative;
`;
