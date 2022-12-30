import { styled } from '@mui/material';
import React from 'react';

import { Node as NodeType } from '../types/Node';
import { NodeContent } from '../types/NodeContent';
import { DraggableElement } from './DraggableElement';

export interface NodeProps<
  NodeTypes extends string = string,
  DataType extends string = string,
> {
  node: NodeType<NodeTypes, DataType>;
  className?: string;
  nodeTypes: Record<NodeTypes, NodeContent<NodeTypes, DataType>>;
}

export const Node = <
  NodeTypes extends string = string,
  DataType extends string = string,
>({
  node,
  className,
  nodeTypes,
}: NodeProps<NodeTypes, DataType>) => {
  console.log(nodeTypes, node.type);
  return (
    <StyledDraggableElement positionInfo={node} className={className}>
      {nodeTypes[node.type]({ node })}
    </StyledDraggableElement>
  );
};

const StyledDraggableElement = styled(DraggableElement)`
  cursor: default;
`;
