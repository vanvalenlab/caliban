import { actions, assign, Machine, send, sendParent } from 'xstate';

const { pure } = actions;

/** Records a stack of snapshots of an actor's state before each action.
 * Sends SAVE events to an actor and stores the actor's responses to send back when undoing or redoing actions.
 */
function createHistoryMachine(actor) {
  return Machine(
    {
      context: {
        actor,
        past: [],
        future: [],
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            SAVE: 'saving',
            UNDO: 'restoringPast',
            REDO: 'restoringFuture',
          },
        },
        saving: {
          entry: 'getSnapshot',
          on: {
            RESTORE: { target: 'idle', actions: 'saveSnapshot' },
          },
          exit: sendParent('SAVED'),
        },
        restoringPast: {
          entry: 'restorePast',
          exit: 'movePastToFuture',
          on: {
            RESTORED: { target: 'idle', actions: 'forwardToParent' },
          },
          // fallback in case actor does not respond
          after: {
            500: {
              target: 'idle',
              actions: [
                sendParent('RESTORED'),
                // TODO: log what actors are not restoring
                () => console.log('could not restore actor'),
              ],
            },
          },
        },
        restoringFuture: {
          entry: 'restoreFuture',
          exit: 'moveFutureToPast',
          on: {
            RESTORED: { target: 'idle', actions: 'forwardToParent' },
          },
          // fallback in case actor does not respond
          after: {
            500: {
              target: 'idle',
              actions: [
                sendParent('RESTORED'),
                // TODO: log what actors are not restoring
                () => console.log('could not restore actor'),
              ],
            },
          },
        },
      },
    },
    {
      actions: {
        forwardToParent: sendParent((ctx, evt) => evt),
        getSnapshot: send('SAVE', { to: (ctx) => ctx.actor }),
        saveSnapshot: assign((ctx, evt) => ({
          past: [...ctx.past, evt],
          future: [],
        })),
        restorePast: send((ctx) => ctx.past[ctx.past.length - 1], {
          to: (ctx) => ctx.actor,
        }),
        restoreFuture: send((ctx) => ctx.future[ctx.future.length - 1], {
          to: (ctx) => ctx.actor,
        }),
        movePastToFuture: assign({
          past: (ctx) => ctx.past.slice(0, ctx.past.length - 1),
          future: (ctx) => [...ctx.future, ctx.past[ctx.past.length - 1]],
        }),
        moveFutureToPast: assign({
          past: (ctx) => [...ctx.past, ctx.future[ctx.future.length - 1]],
          future: (ctx) => ctx.future.slice(0, ctx.future.length - 1),
        }),
      },
    }
  );
}

export default createHistoryMachine;
