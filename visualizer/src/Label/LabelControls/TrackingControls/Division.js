import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { useSelector } from '@xstate/react';
import React, { useReducer, useRef } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { useHexColormap, useImage, useSelect, useTracking } from '../../../ProjectContext';

export const Cell = React.forwardRef(({ label, onClick }, ref) => {
  const colors = useHexColormap();
  const color = colors[label] ?? '#000000';

  return (
    <Avatar
      ref={ref}
      sx={{ m: 1, height: '2.5rem', width: '2.5rem', backgroundColor: color }}
      onClick={onClick}
    >
      {label}
    </Avatar>
  );
});

function Parent({ division }) {
  const { label, daughters, divisionFrame, frames } = division;
  const theme = useTheme();
  const strokeColor = theme.palette.secondary.main;

  const relations = daughters.map((label) => ({
    targetId: `daughter${label}`,
    targetAnchor: 'left',
    sourceAnchor: 'right',
    style: { strokeColor, strokeWidth: 1, noCurves: true },
  }));
  relations.push({
    targetId: 'addDaughter',
    targetAnchor: 'left',
    sourceAnchor: 'right',
    style: { strokeColor, strokeWidth: 1, noCurves: true },
  });

  const select = useSelect();
  const image = useImage();

  const onClick = (e) => {
    select.send({ type: 'SET_FOREGROUND', foreground: label });
    image.send({
      type: 'SET_FRAME',
      frame: divisionFrame ? divisionFrame - 1 : frames[frames.length - 1],
    });
  };

  return (
    <ArcherElement id='parent' relations={relations}>
      <Cell label={label} onClick={onClick} />
    </ArcherElement>
  );
}

function Daughter({ label, daughter, divisionFrame }) {
  const select = useSelect();
  const image = useImage();

  const onClick = () => {
    select.send({ type: 'SET_FOREGROUND', foreground: daughter });
    image.send({ type: 'SET_FRAME', frame: divisionFrame });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ArcherElement id={`daughter${daughter}`}>
        <Cell label={daughter} onClick={onClick} />
      </ArcherElement>
      <DaughterMenu parent={label} daughter={daughter} />
    </Box>
  );
}

function AddDaughter({ label }) {
  const tracking = useTracking();

  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  const handleAddDaughter = () => {
    tracking.send({ type: 'ADD_DAUGHTER', parent: label });
    toggle();
  };
  const handleNewCell = () => {
    tracking.send({ type: 'CREATE_NEW_CELL', label });
    toggle();
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* point arrow to hidden Avatar so arrows look aligned */}
      <ArcherElement id='addDaughter'>
        <Avatar sx={{ m: 1, height: '2.5rem', width: '2.5rem', visibility: 'hidden' }} />
      </ArcherElement>
      <IconButton
        sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
        onClick={toggle}
        ref={anchorRef}
        size='large'
      >
        <AddCircleOutlineIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} placement='bottom-end'>
        <Paper>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList id='add-daughter-menu'>
              <MenuItem onClick={handleAddDaughter}>Add Daughter</MenuItem>
              <MenuItem onClick={handleNewCell}>Create New Cell</MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </Box>
  );
}

function DaughterMenu({ parent, daughter }) {
  const tracking = useTracking();
  const { send } = tracking;

  const [open, toggleOpen] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  const handleRemove = () => {
    send({ type: 'REMOVE', daughter: daughter });
    toggleOpen();
  };

  const handleParent = () => {
    send({ type: 'REPLACE_WITH_PARENT', parent: parent, daughter: daughter });
    toggleOpen();
  };

  return (
    <>
      <IconButton aria-label='Edit daughter' size='small' onClick={toggleOpen} ref={anchorRef}>
        <CloseIcon fontSize='small' />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} placement='bottom-end'>
        <Paper>
          <ClickAwayListener onClickAway={toggleOpen}>
            <MenuList id='remove-daughter-menu'>
              <MenuItem onClick={handleRemove}>Remove from Division</MenuItem>
              {/* <MenuItem onClick={handleNewCell}>Replace with New Cell</MenuItem> */}
              <MenuItem onClick={handleParent}>Replace with Parent</MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

function Daughters({ division }) {
  const { label, daughters, divisionFrame } = division;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {daughters.map((daughter) => (
        <Daughter label={label} daughter={daughter} divisionFrame={divisionFrame} key={daughter} />
      ))}
      <AddDaughter label={label} />
    </Box>
  );
}

const dummyDivision = {
  label: 1,
  parent: 2,
  daughters: [3, 4],
  frames: [0],
  capped: true,
  divisionFrame: 0,
  parentDivisionFrame: 0,
};

export function DivisionFootprint() {
  return (
    <ArcherContainer>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Parent division={dummyDivision} />
        <Daughters division={dummyDivision} />
      </Box>
    </ArcherContainer>
  );
}

function Division({ label }) {
  const tracking = useTracking();
  const division = useSelector(tracking, (state) => state.context.labels[label]);

  return (
    <ArcherContainer>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {division && <Parent division={division} />}
        {division && <Daughters division={division} />}
      </Box>
    </ArcherContainer>
  );
}

export default Division;