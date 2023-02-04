import { styled } from '@mui/material';
import React, { useContext, useRef } from 'react';
import { PropsWithChildren } from 'react';

import { DragContext } from '../DragRoot';

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
}: PropsWithChildren<{ ball: 'start' | 'end' }>) => {
  const { setDraggingElements } = useContext(DragContext);
  const ref = useRef<HTMLDivElement | null>(null);
  console.log(ref);

  return (
    <StyledPort
      order={ball}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('registered element for movement');
        setDraggingElements([
          {
            onMove: (x, y) => {
              console.log(x, y);
            },
          },
        ]);
      }}
    >
      <div style={{ position: 'relative' }}>
        <Ball />
        {/* start of a line, the line and the end of a line. 
        Once dropped, will need to have a ref to both elements and then draw the line there. */}
      </div>
      {children}
    </StyledPort>
  );
};
