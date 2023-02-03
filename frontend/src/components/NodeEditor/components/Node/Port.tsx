import { styled } from '@mui/material';
import React from 'react';
import { PropsWithChildren } from 'react';

const StyledPort = styled('div')<{ order: 'start' | 'end' }>`
  display: flex;
  ${(props) => props.order === 'end' && `flex-direction: row-reverse;`}
  align-items: center;
  gap: 0.5rem;
`;

const Ball = styled('div')`
  background-color: yellow;
  border: 2px solid gray;
  height: 0.75rem;
  aspect-ratio: 1;
  border-radius: 100%;
`;

export const Port = ({
  children,
  ball,
}: PropsWithChildren<{ ball: 'start' | 'end' }>) => (
  <StyledPort order={ball}>
    <Ball />
    {children}
  </StyledPort>
);
