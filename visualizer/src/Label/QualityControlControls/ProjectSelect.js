import { FormLabel, MenuItem, TextField, Tooltip } from '@mui/material';
import { useSelector } from '@xstate/react';
import { useEffect, useRef } from 'react';
import { useQualityControl } from '../../QualityControlContext';

function ProjectSelect() {
  const qualityControl = useQualityControl();

  const projectId = useSelector(qualityControl, (state) => state.context.projectId);
  const projectIds = useSelector(qualityControl, (state) => state.context.projectIds);

  // Adds mousetrap class so hotkeys work after using switch
  const inputRef = useRef();
  useEffect(() => {
    const select = inputRef.current;
    select.className = `${select.className}  mousetrap`;
  }, []);

  const onChange = (e) => {
    qualityControl.send({ type: 'SET_PROJECT', projectId: e.target.value });
  };

  const tooltip = (
    <span>
      Cycle with <kbd>TODO</kbd> or <kbd>Shift</kbd> + <kbd>TODO</kbd>
    </span>
  );

  return (
    <>
      <FormLabel>Project</FormLabel>
      <Tooltip title={tooltip} placement='top'>
        <TextField select size='small' value={projectId} onChange={onChange} inputRef={inputRef}>
          {projectIds.map((projectId) => (
            <MenuItem key={projectId} value={projectId}>
              {projectId}
            </MenuItem>
          ))}
        </TextField>
      </Tooltip>
    </>
  );
}

export default ProjectSelect;