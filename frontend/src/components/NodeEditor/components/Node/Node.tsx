import { styled } from '@mui/material';
import React, { PropsWithChildren } from 'react';

import { Node as NodeType } from '../../types/Node';
import { NodeContent, NodeOverrides } from '../../types/NodeContent';
import { DraggableElement } from '../DraggableElement';
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
          {nodeType.header?.({ node }) ?? <div>{node.type}</div>}
          <hr />
          {nodeType.inputPorts?.({ node }) ?? (
            <PortList orientation="left" ports={node.inputs} />
          )}
          {nodeType.outputPorts?.({ node }) ?? (
            <PortList orientation="right" ports={node.outputs} />
          )}
        </Container>
      )}
    </StyledDraggableElement>
  );
};

const Container = <
  NodeTypes extends string = string,
  DataType extends string = string,
>({
  container: NodeContainer,
  children,
  node,
}: PropsWithChildren<{
  container?: NodeContent<NodeTypes, DataType, PropsWithChildren>;
  node: NodeType<NodeTypes, DataType>;
}>) => {
  if (NodeContainer) {
    return <NodeContainer node={node}>{children}</NodeContainer>;
  }

  return <div>{children}</div>;
};

const StyledDraggableElement = styled(DraggableElement)`
  cursor: default;
`;
