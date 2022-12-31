import { styled } from '@mui/system';
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

export const DragRoot: React.FC<
  PropsWithChildren<{
    defaultOnMove?: (x: number, y: number) => void;
  }>
> = ({ children, defaultOnMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { currentlyDraggingElements, setDraggingElements } =
    useContext(DragContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <Root
      style={{ backgroundPosition: `${offset.x}px ${offset.y}px` }}
      onMouseDownCapture={(event) => {
        setIsDragging(true);
      }}
      onMouseUpCapture={(event) => {
        setIsDragging(false);
        setDraggingElements([]);
      }}
      onMouseMove={(event) => {
        console.log('moving on drag root', isDragging);
        if (!isDragging) {
          return;
        }

        event.preventDefault();
        currentlyDraggingElements.forEach((elem) => {
          elem.onMove(event.movementX, event.movementY);
        });

        if (currentlyDraggingElements.length === 0) {
          defaultOnMove?.(event.movementX, event.movementY);
          setOffset((prev) => ({
            x: prev.x + event.movementX,
            y: prev.y + event.movementY,
          }));
        }
      }}
    >
      {children}
    </Root>
  );
};

interface DragContextProps {
  currentlyDraggingElements: {
    onMove: (movementX: number, movementY: number) => void;
  }[];
  setDraggingElements: (
    elements: {
      onMove: (movementX: number, movementY: number) => void;
    }[],
  ) => void;
}

export const DragContext = React.createContext<DragContextProps>({
  currentlyDraggingElements: [],
  setDraggingElements: () => {},
});

export const DragContextProvider = ({ children }: React.PropsWithChildren) => {
  const [currentlyDraggingElements, setCurrentlyDraggingElements] = useState<
    DragContextProps['currentlyDraggingElements']
  >([]);
  const setDraggingElements = useCallback(
    (elements: DragContextProps['currentlyDraggingElements']) => {
      setCurrentlyDraggingElements(elements);
    },
    [],
  );

  return (
    <DragContext.Provider
      value={{ currentlyDraggingElements, setDraggingElements }}
    >
      {children}
    </DragContext.Provider>
  );
};

const Root = styled('div')`
  width: 100%;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      hsla(0, 0%, 100%, 0.05) 25%,
      hsla(0, 0%, 100%, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      hsla(0, 0%, 100%, 0.05) 75%,
      hsla(0, 0%, 100%, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      hsla(0, 0%, 100%, 0.05) 25%,
      hsla(0, 0%, 100%, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      hsla(0, 0%, 100%, 0.05) 75%,
      hsla(0, 0%, 100%, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-color: #3c3c3c !important;
  background-size: 62.505px 62.505px;
  background-position: -143.728px -39.0024px;
  flex-grow: 1;
  position: relative;
  display: flex;
`;
