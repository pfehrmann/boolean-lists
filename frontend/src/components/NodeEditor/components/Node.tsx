import { styled } from '@mui/material';
import React from 'react';

import { Node as NodeType } from '../types/Node';
import { DraggableElement } from './DraggableElement';

export interface NodeProps {
  node: NodeType;
  className?: string;
}

export const Node = ({ node, className }: NodeProps) => {
  return (
    <StyledDraggableElement positionInfo={node} className={className}>
      Hello
    </StyledDraggableElement>
  );
};

const StyledDraggableElement = styled(DraggableElement)`
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.background.paper};
  border: 2px solid ${({ theme }) => theme.palette.primary.light};
  border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
  cursor: default;
`;
