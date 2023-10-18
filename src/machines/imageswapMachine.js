import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
const swapMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwO4EMAOA6AlhANmAMQ4B2OALgNoAMAuoqBgPayU7OmMgAeiAtAHZBWAJzjRAVgBs0gEzSAjIrkBmSQBoQATwEAOGljkLJgtXtUAWeXMEBfO1tSYsAJzBoI2os4y0GSCAsbBQcXIF8CCqWWDRxNJaqqoKqenqC0po6iApiEqI0ypnJKQ5O6Ni+GGRQRDywFGgUYFhoAGbNrgAUkvEAlD4VWFU1-tzB7JzckVaiWKoF8lm6CHJ6WJb5hYrFwqoOjiCkzBBw3L7jrJPhoJH8qnKiWiv8OyJmmXpKCZaSipZ6MogXy4AhgS4hMLTARrRTPASmLC9OL-PTiSRfQS-IEg9yeFZMK6hKYRRCKdRIySWFI0dKpdKZeEIfiI5GFAHozHYw4gkakKAQ67QqJWIymPSSDEpNIZZZkwSKPISba7UoHIA */
    id: "swap",
    initial: "idle",
    context: {
      mainPic: null,
      swapPic: null,
    },
    states: {
      idle: {
        on: {
          init: {
            target: "ready",
            actions: "assignMain",
          },
        },
      },

      ready: {
        on: {
          swap: {
            target: "swapping",
            actions: "assignSwap",
          },
        },
      },

      swapping: {
        after: {
          5000: {
            target: "ready",
            actions: "resetSwap",
          },
        },
      },
    },
  },
  {
    actions: {
      assignMain: assign((_, event) => ({
        mainPic: event.pic,
      })),
      assignSwap: assign((_, event) => ({
        swapPic: event.pic,
      })),
      resetSwap: assign((context) => ({
        mainPic: context.swapPic,
        swapPic: null,
      })),
    },
  }
);

export const useImageSwap = () => {
  const [state, send] = useMachine(swapMachine);

  return {
    state,
    send,
    ...state.context,
    states: swapMachine.states,
  };
};
