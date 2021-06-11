import { useSelector } from '@xstate/react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { useRaw } from '../../ServiceContext';
import LayerController from './LayerController';

function RGBControls() {
  const raw = useRaw();
  const colorMode = useSelector(raw, state => state.context.colorMode);
  const layers = useSelector(colorMode, state => state.context.layers);
  
  return <>
  {layers.map(
      (layer, index) =>
        <Grid
          // key={`channel-controller-${name}-${id}`}
          style={{ width: '100%' }}
          item
        >
          <LayerController layer={layer} />
        </Grid>
    )}
    <Button
      onClick={() => raw.send('ADD_LAYER')}
      fullWidth
      variant="outlined"
      style={{ borderStyle: 'dashed' }}
      startIcon={<AddIcon />}
      size="medium"
    >
      Add Channel
    </Button>
  </>;
}

export default RGBControls;