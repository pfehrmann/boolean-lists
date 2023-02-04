import { styled } from '@mui/material';
import React, { PropsWithChildren } from 'react';

import { Node as NodeType } from '../../types/Node';
import { NodeContent } from '../../types/NodeContent';

export const Container = <
  NodeTypes extends string = string,
  DataType extends string = string,
>({
  container: NodeContainer,
  children,
  node,
  className,
}: PropsWithChildren<{
  container?: NodeContent<NodeTypes, DataType, PropsWithChildren>;
  node: NodeType<NodeTypes, DataType>;
  className?: string;
}>) => {
  if (NodeContainer) {
    return (
      <NodeContainer className={className} node={node}>
        {children}
      </NodeContainer>
    );
  }

  return <StyledContainer className={className}>{children}</StyledContainer>;
};

const StyledContainer = styled('div')`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(1)};
  grid-template-areas:
    'header header header'
    'left center right';
`;
