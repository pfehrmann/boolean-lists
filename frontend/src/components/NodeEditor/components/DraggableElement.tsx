import { styled } from '@mui/system';
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

import { WithPosition } from '../types/WithPosition';
import { DragContext } from './DragRoot';

export interface DraggableElementProps {
  positionInfo: WithPosition;
  className?: string;
}

const UnmemoizedDraggableElement = ({
  positionInfo,
  className,
  children,
}: PropsWithChildren<DraggableElementProps>) => {
  const rerender = useRenders();
  const onMove = (movementX: number, movementY: number) => {
    console.log('moving element');
    positionInfo.position.x += movementX;
    positionInfo.position.y += movementY;

    rerender();
  };

  const { setDraggingElements } = useContext(DragContext);

  return (
    <Root
      x={positionInfo.position.x}
      y={positionInfo.position.y}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('registered element for movement');
        setDraggingElements([{ onMove }]);
      }}
      className={className}
    >
      {children}
    </Root>
  );
};

const Root = styled('div')<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
`;

const useRenders = () => {
  const [, setRenders] = useState(0);

  return useCallback(() => setRenders((prev) => prev + 1), []);
};

export const DraggableElement = React.memo(UnmemoizedDraggableElement);
