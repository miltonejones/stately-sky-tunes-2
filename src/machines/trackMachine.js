import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
const trackMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAxgawHQEsIAbMAYgHsAHMAOwG0AGAXUVEvNn2X3JtZAAeiAEwBmACy4AbMPHCArAwDsChQA4AnEoA0IAJ6IAjMMO5hSiYrXz5o0RtHyAvk91oseALbkI6IgAJ8WH8qWlJMIg4wRhYkEHZObl5+IQRxUzkZNUM1KXEpYzUGcV0DBABaeVxDW2EpUTqGBgkFQxdXEBofOH53HH4Erh4+ONTyqVx5CyUcw0dRNRmNKVLEco1haVqbdI1jKTU1FzcMHAJiMAGOIeTRxDkthiK7Q8MlWwZ5VYRDcXFjkB9Lw+PyBYKhEZsa5JSGCETySRKFTyIr1JS5cQab4TJTNZYqOwI0RSJ7tJxAA */
    id: "track",
    initial: "idle",
    context: { track: {} },
    states: {
      idle: {
        on: {
          open: {
            target: "modal is open",
            actions: "assignTrack",
          },
        },
      },

      "modal is open": {
        on: {
          close: "idle",
        },
      },
    },
  },
  {
    actions: {
      assignTrack: assign((_, event) => ({
        track: event.track,
      })),
    },
  }
);

export const useTrack = (machine) => {
  const [state, send] = useMachine(trackMachine);

  return {
    state,
    send,
    machine,
    tell: (msg) => machine.send(msg),
  };
};
