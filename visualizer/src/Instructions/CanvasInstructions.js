import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Shortcut, Shortcuts } from './Shortcuts';

function CanvasShortcuts() {
  return (
    <Shortcuts>
      <Shortcut text='Zoom out ' shortcut='-' />
      <Shortcut text='Zoom in' shortcut='=' />
    </Shortcuts>
  );
}

const CanvasInstructions = () => {
  return (
    <Box display='flex' justifyContent='space-between'>
      <div>
        <Typography variant='h5'>Navigate the Canvas</Typography>
        <Typography>
          Scroll down to zoom in.
          <br />
          Scroll up to zoom out.
          <br />
          Click and drag to pan around the canvas.
          <br />
          Hold <kbd>Space</kbd> and click and drag to pan around the canvas when using a tool that
          uses dragging (e.g. Brush or Threshold).
        </Typography>
        <Typography variant='h5'>Canvas Borders</Typography>
        <Typography>
          The borders of the canvas help show where we are within an image.
          <br />
          If a border is white, we are along an edge of the image.
          <br />
          If a border is black, the image extends off-canvas in that direction and we can pan or
          zoom out to view it.
        </Typography>
      </div>
      <CanvasShortcuts />
    </Box>
  );
};

export default CanvasInstructions;
