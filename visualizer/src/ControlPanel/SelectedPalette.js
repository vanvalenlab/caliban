import React, { useState } from 'react';
import { useSelector } from '@xstate/react';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { useToolbar } from '../ServiceContext';


const useStyles = makeStyles(theme => ({
  palette: {
    position: 'relative',
    margin: theme.spacing(1),
  },
  foreground: {
    position: 'absolute',
    zIndex: 1,
    top: '0px',
    left: '0px',
    width: '60px',
    height: '60px',
    border: '5px solid #DDDDDD',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    width: '60px',
    height: '60px',
    border: '5px solid #DD0000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  swap: {
    position: 'absolute',
    left: '60px',
    top: '-5px',
  },
  leftArrow: {
    transform: 'rotate(-90deg)',
  },
  rightArrow: {
    position: 'absolute',
    transform: 'rotate(180deg)',
    top: '8px',
    left: '8px',
  },
  help: {
    position: 'absolute',
    right: '8px',
  }
}));

export function SwapButton() {
  const styles = useStyles();

  const toolbar = useToolbar();
  const { send } = toolbar;
  const foreground = useSelector(toolbar, state => state.context.foreground);
  const background = useSelector(toolbar, state => state.context.background);

  const handleClick = () => {
    send('FOREGROUND', { foreground: background });
    send('BACKGROUND', { background: foreground });
  };

  return (
    <Tooltip title='Press X to swap.'>
      <IconButton
        className={styles.swap}
        color="primary"
        onClick={handleClick}
      >
        <SubdirectoryArrowLeftIcon className={styles.leftArrow} />
        <SubdirectoryArrowRightIcon className={styles.rightArrow} />
      </IconButton>
    </Tooltip>
  );

}

function ForegroundBox() {
  const toolbar = useToolbar();
  const { send } = toolbar;
  const foreground = useSelector(toolbar, state => state.context.foreground);
  const noLabel = foreground === 0;
  
  const [showButtons, setShowButtons] = useState(false);
  const buttonColor = noLabel ? 'secondary' : 'default';

  const styles = useStyles();

  return (
    <Tooltip title='Cycle with [ and ].'>
      <Box
        component='rect' 
        className={styles.foreground}
        style={{ background: noLabel ? 'black' : 'white' }}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        {showButtons && 
          <IconButton size='small' onClick={() => send('PREV_FOREGROUND')}>
            <ArrowBackIosIcon color={buttonColor} />
          </IconButton>
        }
        {showButtons && 
          <IconButton size='small' onClick={() => send('NEXT_FOREGROUND')}>
            <ArrowBackIosIcon color={buttonColor} style={{transform: 'rotate(180deg)'}} />
          </IconButton>
        }
      </ Box>
    </Tooltip>
  );
}

function BackgroundBox() {
  const toolbar = useToolbar();
  const { send } = toolbar;
  const background = useSelector(toolbar, state => state.context.background);
  const noLabel = background === 0;
  
  const [showButtons, setShowButtons] = useState(false);
  const buttonColor = noLabel ? 'secondary' : 'default';

  const styles = useStyles();

  return (
    <Tooltip title='Cycle with { and }.'>
      <Box
        component='rect' 
        className={styles.background}
        style={{ background: noLabel ? 'black' : 'white' }}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        {showButtons && 
          <IconButton size='small' onClick={() => send('PREV_BACKGROUND')}>
            <ArrowBackIosIcon color={buttonColor} />
          </IconButton>
        }
        {showButtons && 
          <IconButton size='small' onClick={() => send('NEXT_BACKGROUND')}>
            <ArrowBackIosIcon color={buttonColor} style={{ transform: 'rotate(180deg)'}} />
          </IconButton>
        }
      </ Box>
    </Tooltip>
  );
}

export default function SelectedPalette() {
  const styles = useStyles();

  const tooltipText = (<span>
    When the foreground is no label,
    the top box is black.
    <br />
    When the background is no label,
    the bottom box is black.
  </span>);

  return (
    <Box className={styles.palette}>
      <ForegroundBox />
      <BackgroundBox />
      <SwapButton />
      <Tooltip title={tooltipText}>
        <HelpOutlineIcon className={styles.help} color="action" fontSize="large" />
      </Tooltip>
    </Box>
  );
}
