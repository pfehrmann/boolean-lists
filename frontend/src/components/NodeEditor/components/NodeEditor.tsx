import { Box, styled } from '@mui/material';
import React, { useContext, useState } from 'react';

import { Node as NodeType } from '../types/Node';
import { DragContext, DragContextProvider, DragRoot } from './DragRoot';
import { Node } from './Node';

export interface NodeEditorProps<NodeTypes = string, DataType = string> {
  nodes: NodeType<NodeTypes, DataType>[];
  onChange?: (updatedNodes: NodeType<NodeTypes, DataType>[]) => void;
}

export const NodeEditor = ({ nodes }: NodeEditorProps) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const onMove = (movementX: number, movementY: number) => {
    console.log('moving editor');
    setOffsetX((prev) => prev + movementX);
    setOffsetY((prev) => prev + movementY);
  };

  return (
    <DragContextProvider>
      <DragRoot defaultOnMove={onMove}>
        <StyledCanvas offsetX={offsetX} offsetY={offsetY} onMove={onMove}>
          {nodes.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </StyledCanvas>
      </DragRoot>
    </DragContextProvider>
  );
};

const Canvas = ({
  children,
  offsetX,
  offsetY,
  onMove,
}: React.PropsWithChildren<{
  offsetX: number;
  offsetY: number;
  onMove: (x: number, y: number) => void;
}>) => {
  const { setDraggingElements } = useContext(DragContext);

  return (
    <Box
      sx={{
        marginLeft: `${offsetX}px`,
        marginTop: `${offsetY}px`,
        width: '100%',
        background: 'gray',
        flexGrow: 1,
        position: 'relative',
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('registered editor for movement');
        setDraggingElements([{ onMove }]);
      }}
    >
      {children}
    </Box>
  );
};

const StyledCanvas = styled(Canvas)`
  width: 100%;
  background: blue;
  flex-grow: 1;
  position: relative;
`;
