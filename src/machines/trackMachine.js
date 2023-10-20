import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import getLyrics from "../connector/getLyrics";
const trackMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAxgawHQEsIAbMAYgHsAHMAOwG0AGAXUVEvNn2X3JtZAAeiAEwBWAJy4A7KIBs40XIDMUgByyALONkAaEAE9EARmFHcwqUo3CbGk0YbiNAX2d60WPAFtyEdEQACfFgAqlpSTCIOMEYWJBB2Tm5efiEERXMlWSkNBlV8oxlhcT1DBFlpBiVtKWElJVENLLzXdwwcXB8-QODQ6hpSIn1UfExY-kSuHj54tKsKoyNZeoZltU0Sg0QAWnVzbSqLWU1lcVaQDw6AM3waCADYXigAoZHMWFIIXjACGgA3cjYH6XPA3O4PJ4vYajWAIW4AzDoZL0ZjjeKTZGpRAaWTCcxaIxNIwqdRaUo7Qm4UQ2CTU44aU7CVxuEA0XxwfggiYcKYpWY7US4KziIzaWSLVTCHEKckIbb1PFSA5KI4nTTnEEEYhgblJaZYhDWXCyUR5KpKAoyJQMUSywkuFmarr+IIhMIzNg8zH8hBiDTSWqiVSrEkbWUVKRVGp1BpNWQtR3tUG3e6PGjPV4w3W8j2CRBZCqiQlSWSqYnrMlbOVSwXFeMqktqh2uIA */
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
          lyric: "find song lyrics",
        },
      },

      "find song lyrics": {
        invoke: {
          src: "findLyrics",
          onDone: {
            target: "modal is open",
            actions: "assignLyrics",
          },
        },

        description: `Download song lyrics from API`,
      },
    },
  },
  {
    services: {
      findLyrics: async (context) => {
        const { track } = context;
        return await getLyrics(track.Title, track.artistName);
      },
    },
    actions: {
      assignTrack: assign((_, event) => ({
        track: event.track,
      })),
      assignLyrics: assign((_, event) => ({
        lyrics: event.data,
      })),
    },
  }
);

export const useTrack = (machine) => {
  const [state, send] = useMachine(trackMachine);

  return {
    state,
    send,
    ...state.context,
    machine,
    tell: (msg) => machine.send(msg),
  };
};
