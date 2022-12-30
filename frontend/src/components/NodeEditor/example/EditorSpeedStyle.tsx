import Add from '@mui/icons-material/Add';
import PlaylistAddCheck from '@mui/icons-material/PlaylistAddCheck';
import SaveIcon from '@mui/icons-material/Save';
import TextFields from '@mui/icons-material/TextFields';
import { styled } from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import React, { useState } from 'react';

import { Node } from '../types/Node';
import { AddNodeDialog } from './AddNodeDialog';
import { ExampleDataType, ExampleNodes } from './types';

export interface EditorSpeedDialProps {
  onAdd: (node: Node<ExampleNodes, ExampleDataType>) => void;
}

export const EditorSpeedDial = ({ onAdd }: EditorSpeedDialProps) => {
  const [open, setOpen] = useState(false);
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false);
  const handleCloseDial = () => {
    setOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <StyledSpeedDial
        ariaLabel="SpeedDial example"
        icon={<SpeedDialIcon />}
        onBlur={handleCloseDial}
        onClick={handleSpeedDialOpen}
        onClose={handleCloseDial}
        onFocus={handleSpeedDialOpen}
        onMouseEnter={handleSpeedDialOpen}
        onMouseLeave={handleCloseDial}
        open={open}
        direction={'up'}
      >
        <SpeedDialAction
          icon={<SaveIcon />}
          tooltipTitle={'Save graph ([Alt]+[Shift]+S)'}
        />
        <SpeedDialAction
          icon={<PlaylistAddCheck />}
          tooltipTitle={'Save to Spotify'}
        />
        <SpeedDialAction icon={<TextFields />} tooltipTitle={'Serialization'} />
        <SpeedDialAction
          icon={<Add />}
          tooltipTitle={'Add Node ([Alt]+[Shift]+A)'}
          onClick={() => setAddNodeDialogOpen(true)}
        />
      </StyledSpeedDial>
      <AddNodeDialog
        open={addNodeDialogOpen}
        onClose={() => setAddNodeDialogOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
};

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  bottom: theme.spacing(2),
  position: 'absolute',
  right: theme.spacing(3),
}));
