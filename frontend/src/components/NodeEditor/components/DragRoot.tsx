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
  return (
    <Root
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
          console.log('onMove', event.movementX, event.movementY);
          return elem.onMove(event.movementX, event.movementY);
        });

        if (currentlyDraggingElements.length === 0) {
          defaultOnMove?.(event.movementX, event.movementY);
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
  background: gray;
  flex-grow: 1;
  position: relative;
  display: flex;
`;
