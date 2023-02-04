import { Box, styled } from '@mui/material';
import React from 'react';

import { Node as NodeType } from '../../types/Node';
import { NodeOverrides } from '../../types/NodeContent';
import { DraggableElement } from '../DraggableElement';
import { Container } from './Container';
import { PortList } from './PortList';

export interface NodeProps<
  NodeTypes extends string = string,
  DataType extends string = string,
> {
  node: NodeType<NodeTypes, DataType>;
  className?: string;
  nodeTypes: Record<NodeTypes, NodeOverrides<NodeTypes, DataType>>;
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
  const nodeType = nodeTypes[node.type];
  return (
    <StyledDraggableElement positionInfo={node} className={className}>
      {typeof nodeType === 'function' && nodeType({ node })}
      {typeof nodeType !== 'function' && (
        <Container node={node} container={nodeType.container}>
          {nodeType.header?.({ node }) ?? (
            <Box sx={{ gridArea: 'header' }}>{node.type}</Box>
          )}
          {nodeType.inputPorts?.({ node }) ?? (
            <Box sx={{ gridArea: 'left' }}>
              <PortList orientation="left" ports={node.inputs} />
            </Box>
          )}
          {nodeType.outputPorts?.({ node }) ?? (
            <Box sx={{ gridArea: 'right' }}>
              <PortList orientation="right" ports={node.outputs} />
            </Box>
          )}
        </Container>
      )}
    </StyledDraggableElement>
  );
};

const StyledDraggableElement = styled(DraggableElement)`
  cursor: default;
`;
