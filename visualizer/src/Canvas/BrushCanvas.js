import React, { useEffect, useRef } from 'react';
import { useSelector } from '@xstate/react';
import { useCanvas, useTool, useToolbar } from '../ServiceContext';
import { drawTrace, drawBrush } from '../imageUtils';

const BrushCanvas = ({ className }) => {

  const canvas = useCanvas();
  const sx = useSelector(canvas, state => state.context.sx);
  const sy = useSelector(canvas, state => state.context.sy);
  const zoom = useSelector(canvas, state => state.context.zoom);
  const scale = useSelector(canvas, state => state.context.scale);
  const sw = useSelector(canvas, state => state.context.width);
  const sh = useSelector(canvas, state => state.context.height);
  
  const width = sw * scale * window.devicePixelRatio;
  const height = sh * scale * window.devicePixelRatio;

  const toolbar = useToolbar();
  const foreground = useSelector(toolbar, state => state.context.foreground);
  const background = useSelector(toolbar, state => state.context.background);
  const erasing = foreground === 0 && background !== 0;
  const brushColor = erasing ? [255, 0, 0, 255] : [255, 255, 255, 255];

  const brush = useTool();
  const x = useSelector(brush, state => state.context.x);
  const y = useSelector(brush, state => state.context.y);
  const trace = useSelector(brush, state => state.context.trace);
  const brushSize = useSelector(brush, state => state.context.brushSize);

  const canvasRef = useRef();
  const ctx = useRef();
  useEffect(() => {
    ctx.current = canvasRef.current.getContext('2d');
    ctx.current.imageSmoothingEnabled = false;
  }, [width, height]);

  // create references for the brush outline and trace
  const brushCanvas = useRef();
  const brushCtx = useRef();
  const traceCanvas = useRef();
  const traceCtx = useRef();
  useEffect(() => {
    brushCtx.current = brushCanvas.current.getContext('2d');
    traceCtx.current = traceCanvas.current.getContext('2d');
  }, [sw, sh]);

  // draws the brush outline
  useEffect(() => {
    brushCtx.current.clearRect(0, 0, sw, sh);
    drawBrush(brushCtx.current, x, y, brushSize, brushColor);
  }, [brushCtx, x, y, brushSize, brushColor, sh, sw]);

  // draws the brush trace
  useEffect(() => {
    if (trace.length === 0) { // clear the trace canvas
      traceCtx.current.clearRect(0, 0, sw, sh);
    } else { // add to trace
      const [tx, ty] = trace[trace.length - 1];
      drawTrace(traceCtx.current, tx, ty, brushSize);
    }
  }, [traceCtx, trace, brushSize, sh, sw]);

  // redraws the brush trace when resizing the brush size
  useEffect(() => {
    traceCtx.current.clearRect(0, 0, sh, sw);
    for (const [tx, ty] of trace) {
      drawTrace(traceCtx.current, tx, ty, brushSize);
    }
  }, [traceCtx, brushSize]);

  // draws the brush outline and trace onto the visible canvas
  useEffect(() => {
    ctx.current.clearRect(0, 0, width, height);
    ctx.current.drawImage(
      traceCanvas.current,
      sx, sy,
      sw / zoom, sh / zoom,
      0, 0,
      width, height,
    );
    ctx.current.drawImage(
      brushCanvas.current,
      sx, sy,
      sw / zoom, sh / zoom,
      0, 0,
      width, height,
    );
  }, [trace, brushSize, brushColor, x, y, sx, sy, zoom, sw, sh, width, height]);

  return <>
    <canvas id='brush-processing'
      hidden={true}
      ref={brushCanvas}
      width={sw}
      height={sh}
    />
    <canvas id='trace-processing'
      hidden={true}
      ref={traceCanvas}
      width={sw}
      height={sh}
    />
    <canvas id='brush-canvas'
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  </>;
};

export default React.memo(BrushCanvas);