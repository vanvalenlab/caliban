import { assign, Machine, send } from 'xstate';
import { fromEventBus } from '../../eventBus';
import { toolActions, toolGuards } from './toolUtils';

const createBrushMachine = (context) =>
  Machine(
    {
      invoke: [
        { src: 'listenForBrushHotkeys' },
        { src: fromEventBus('brush', () => context.eventBuses.select) },
        { id: 'api', src: fromEventBus('brush', () => context.eventBuses.api) },
      ],
      context: {
        x: 0,
        y: 0,
        foreground: context.foreground,
        background: context.background,
        trace: [],
        brushSize: 5,
      },
      initial: 'idle',
      states: {
        idle: {
          entry: assign({ trace: [] }),
          on: {
            mousedown: [{ cond: 'shift' }, { target: 'dragging', actions: 'addToTrace' }],
          },
        },
        dragging: {
          on: {
            EXIT: 'idle',
            COORDINATES: { actions: ['setCoordinates', 'addToTrace'] },
            mouseup: { target: 'done', actions: 'paint' },
          },
        },
        // needed avoid sending empty trace in EDIT event
        done: {
          always: 'idle',
        },
      },
      on: {
        INCREASE_BRUSH_SIZE: { actions: 'increaseBrushSize' },
        DECREASE_BRUSH_SIZE: { actions: 'decreaseBrushSize' },
        COORDINATES: { actions: 'setCoordinates' },
        FOREGROUND: { actions: 'setForeground' },
        BACKGROUND: { actions: 'setBackground' },
      },
    },
    {
      services: {
        listenForBrushHotkeys: () => (send) => {
          const lookup = {
            ArrowUp: 'INCREASE_BRUSH_SIZE',
            ArrowDown: 'DECREASE_BRUSH_SIZE',
          };
          const listener = (e) => {
            if (e.key in lookup) {
              e.preventDefault();
              send(lookup[e.key]);
            }
          };
          window.addEventListener('keydown', listener);
          return () => window.removeEventListener('keydown', listener);
        },
      },
      guards: toolGuards,
      actions: {
        ...toolActions,
        increaseBrushSize: assign({
          brushSize: ({ brushSize }) => brushSize + 1,
        }),
        decreaseBrushSize: assign({
          brushSize: ({ brushSize }) => Math.max(1, brushSize - 1),
        }),
        addToTrace: assign({ trace: ({ trace, x, y }) => [...trace, [x, y]] }),
        paint: send(
          (context) => ({
            type: 'EDIT',
            action: 'handle_draw',
            args: {
              trace: JSON.stringify(context.trace),
              foreground: context.foreground,
              background: context.background,
              brush_size: context.brushSize,
            },
          }),
          { to: 'api' }
        ),
      },
    }
  );

export default createBrushMachine;
