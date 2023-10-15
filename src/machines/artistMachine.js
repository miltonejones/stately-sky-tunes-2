import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { getMusicList } from "../connector/getMusicList";
const artistMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMBOAXAlrdA6TEANmAMQD2ADmAHYDaADALqKgVmyZZnUsgAeiALQAWAEy4AnFIkAOAMzCA7AEZFM1cIBsAGhABPRMtz1RCgKzCTMiZs03NigL6PdaLDlwAzTNQgACN2x0EghuMHxqADcyAGtwwI9vXwCMIIQfaIBjZC46JgZmJBA2DlzeAQRRO1xNS1rlM1EZUWVm3QMEZWVNXCVNM0UJK3sJJxcQBLxUMDYMP2nYNmpYUlDqcIzY+NSPadn0ebgllfSosmzcgoLeEs5MbnKhOVrcOSHNehklVXUZdsQ5Mp6LhRFUBkMmiMxq4dngkv5JiQwKhUGRULgKIQcp40QBbXCTLw+BGw05ZHL3PKMa5FW5lIoVGTA+gs+jdRrNVqmf4IEQgxQKUT0UZAuRyehi5zjahkCBwXiTG7sO4PBlCYTKcRvegfL4qNStHmCCTiRqC4UqCXiuTOGHuPAEYhK0qUx688USXAC4RyMx6n6G-SIGResws9mQ2w2aETWFE5KK2nK+mgCqmMzGVkRznNORGjMmc0iq1W22x+24PZog4LY5gZ0qnhqyrKT0fCRvBpNFq5nlVIx9cHDKNjZxAA */
    id: "artist",
    initial: "idle",
    states: {
      idle: {
        on: {
          open: {
            target: "find artist",
            actions: assign((_, event) => ({
              selectedID: event.ID,
            })),
          },
        },
      },

      "find artist": {
        invoke: {
          src: "getArtist",

          onDone: {
            target: "report response",
            actions: "assignArtist",
          },

          onError: "idle",
        },
      },

      "report response": {
        invoke: {
          src: "sendCompleteSignal",
          onDone: "idle",
        },
      },
    },
  },
  {
    actions: {
      assignArtist: assign((_, event) => ({
        artistProps: event.data?.row,
      })),
    },
  }
);

export const useArtist = (onComplete) => {
  const [state, send] = useMachine(artistMachine, {
    services: {
      getArtist: async (context) => {
        return getMusicList(
          {
            page: 1,
            type: "artist",
            field: "discNumber,trackNumber",
            direction: "ASC",
          },
          context.selectedID
        );
      },
      sendCompleteSignal: async (context) =>
        onComplete && onComplete(context.artistProps),
    },
  });

  return {
    state,
    send,
    find: (ID) => send({ type: "open", ID }),
  };
};
