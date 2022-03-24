import Box from '@mui/material/Box';
import DisplayControls from './DisplayControls';
import Instructions from './Instructions';
import LabelControls from './LabelControls';
import LabelTabs from './LabelControls/LabelTabs';
import QualityControlControls from './QualityControlControls/QualityControlControls';
import SpaceFillingCanvas from './SpaceFillingCanvas';

function Label({ review }) {
  const search = new URLSearchParams(window.location.search);
  const track = search.get('track');

  return (
    <>
      <Instructions />
      <Box
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          flexGrow: 1,
          p: 1,
          alignItems: 'stretch',
          justifyContent: 'space-evenly',
          minHeight: 'calc(100vh - 73px - 56px - 76px - 2px)',
        }}
      >
        <Box
          sx={{
            flex: '0 0 auto',
            p: 1,
          }}
        >
          {track && process.env.REACT_APP_SPOTS_VISUALIZER !== 'true' && <LabelTabs />}
          {review && process.env.REACT_APP_SPOTS_VISUALIZER !== 'true' && (
            <QualityControlControls />
          )}
          <DisplayControls />
        </Box>
        {process.env.REACT_APP_SPOTS_VISUALIZER !== 'true' && <LabelControls />}
        <SpaceFillingCanvas />
      </Box>
    </>
  );
}

export default Label;