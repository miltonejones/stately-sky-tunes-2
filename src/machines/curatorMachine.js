import { useMachine } from "@xstate/react";

import { assign, createMachine } from "xstate";
import { getAppleMatches } from "../connector/getAppleMatches";
import { getAlbumorArtistId } from "../connector/getAlbumorArtistId";
import { saveTrack } from "../connector/saveTrack";
export const ADD_ARTIST = 1;
export const ADD_ALBUM = 2;
export const ADD_BOTH = 3;

const curatorMachine = createMachine(
  {
    /** @xstate-layout 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-G6h7FUYcqgvKeE8EAA */
    id: "curator",
    initial: "find",
    context: { track: {}, add_pref: ADD_BOTH },
    states: {
      find: {
        on: {
          open: {
            target: "opened",
            actions: "assignParam",
          },
        },
      },

      opened: {
        states: {
          "enter search param": {
            on: {
              change: {
                target: "enter search param",
                internal: true,
                actions: "assignChange",
              },

              search: "find matches",
            },
          },

          "find matches": {
            invoke: {
              src: "findMatches",
              onDone: {
                target: "show results",
                actions: "assignMatches",
              },
            },
          },

          "show results": {
            on: {
              retry: "enter search param",

              okay: {
                target: "#curator.curate selection",
                actions: "assignResponse",
              },

              changepref: {
                target: "show results",
                internal: true,
                actions: "assignPref",
              },
            },

            description: `Search results are diplayed in the UI.`,
          },
        },

        initial: "enter search param",

        on: {
          close: "find",
        },
      },

      "accept option": {
        on: {
          accept: "update track info",
          cancel: "find",
          retry: "opened.show results",
        },

        description: `Curated track displays in the interface for user acceptance.`,
      },

      "curate selection": {
        states: {
          "get artist": {
            invoke: {
              src: "getTrackArtist",
              onDone: {
                target: "check for album",
                actions: "assignTrackArtist",
              },
            },
          },

          "get album": {
            invoke: {
              src: "getTrackAlbum",
              onDone: {
                target: "#curator.accept option",
                actions: "assignTrackAlbum",
              },
            },
          },

          "check for artist": {
            always: [
              {
                target: "get artist",
                cond: "should add artists",
              },
              "check for album",
            ],
          },

          "check for album": {
            always: [
              {
                target: "get album",
                cond: "should add albums",
              },
              "#curator.accept option",
            ],
          },
        },

        initial: "check for artist",
      },

      "update track info": {
        invoke: {
          src: "commitTrack",
          onDone: "send response",
        },
      },

      "send response": {
        invoke: {
          src: "sendAcceptSignal",
          onDone: "find",
        },
      },
    },
  },
  {
    guards: {
      "should add artists": (context) => !!(context.add_pref & ADD_ARTIST),
      "should add albums": (context) => !!(context.add_pref & ADD_ALBUM),
    },
    actions: {
      assignTrackArtist: assign((context, event) => {
        return {
          track: {
            ...context.track,
            artistFk: event.data,
          },
        };
      }),
      assignTrackAlbum: assign((context, event) => {
        return {
          track: {
            ...context.track,
            albumFk: event.data,
          },
        };
      }),
      assignMatches: assign((_, event) => ({
        matches: event.data,
        add_pref: ADD_BOTH,
      })),
      assignPref: assign((context, event) => ({
        add_pref:
          context.add_pref & event.bit
            ? context.add_pref - event.bit
            : context.add_pref + event.bit,
      })),
      assignParam: assign((_, event) => ({
        track: event.track,
        param: `${event.track.Title} ${event.track.artistName}`,
      })),
      assignResponse: assign((context, event) => {
        return {
          answer: event.answer,
          track: {
            ...context.track,
            ...event.answer,
            artistName:
              context.add_pref & ADD_ARTIST
                ? event.answer.artistName
                : context.track.artistName,
            albumName:
              context.add_pref & ADD_ALBUM
                ? event.answer.albumName
                : context.track.albumName,
          },
        };
      }),
      assignChange: assign((_, event) => ({
        [event.name]: event.value,
      })),
    },
  }
);

export const useCurator = (onComplete) => {
  const [state, send] = useMachine(curatorMachine, {
    services: {
      findMatches: async (context) => {
        return await getAppleMatches(context.param);
      },
      sendAcceptSignal: async (context) => {
        onComplete && onComplete(context.track);
      },

      getTrackAlbum: async (context) => {
        const { answer } = context;
        return await getAlbumorArtistId(
          "album",
          answer.albumName,
          answer.albumImage
        );
      },

      getTrackArtist: async (context) => {
        const { answer } = context;
        return await getAlbumorArtistId(
          "artist",
          answer.artistName,
          answer.albumImage
        );
      },
      commitTrack: async (context) => {
        return await saveTrack(context.track);
      },
    },
  });

  return {
    state,
    send,
  };
};
