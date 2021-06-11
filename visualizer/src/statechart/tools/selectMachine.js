import { Machine, sendParent } from 'xstate';
import { toolActions, toolGuards } from './toolUtils';

const createSelectMachine = ({label, foreground, background }) => Machine(
  {
    context: {
      label,
      foreground,
      background,
    },
    on: {
      FOREGROUND: { actions: 'setForeground' },
      BACKGROUND: { actions: 'setBackground' },
      LABEL: { actions: 'setLabel' },
      mouseup: [
        { cond: 'doubleClick', actions: ['selectBackground', 'resetForeground'] },
        { cond: 'onForeground', actions: 'selectBackground', },
        { actions: 'selectForeground' },
      ],
    }
  },
  {
    guards: toolGuards,
    actions: {
      ...toolActions,
      selectForeground: sendParent('SELECTFOREGROUND'),
      selectBackground: sendParent('SELECTBACKGROUND'),
      resetForeground: sendParent({ type: 'FOREGROUND', foreground: 0 }),
    }
  }
);

export default createSelectMachine;