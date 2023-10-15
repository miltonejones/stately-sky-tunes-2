import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { getIntro } from "../util/getIntro";
import { speakText } from "../util/speakText";
const announcerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMB2qD2BXVBjMATgHQCWEANmAMRqY74DaADALqKgAOGsJALiRlTsQAD0QBaABwA2IgFYAzE2kK5ARgCcagEwB2OdrkAaEAE9Eu3UQAs1pk2vSmamUzm7rAX08na2PISkFNSwHGDIANbMbEggXDz8gsJiCOLS1mpEuk7Z6XIq7ibmCNoZRAoalRnKTJIK1qrevuj++MQwvAAEfvRgALZgqLxEAG7I5GTIvGCdBGAAjlhwvFTRwvF8AkKxKQraCkRaatZyJ0y6ktrKRYiGGkTS0ppMV9qPGjJNID0B7WBdP3wAyGo3Gk2mswWS1gKwYahinG4mySO0Ql0O1kkumOGgaCjU+UkNxKcnuj2er3enx83xavT+ALpAWBw3IGGQEG6TKBgy60xEKwggjApFQIwwERFgMCHS5dGZvKIbI5cta-V5nX5vAQJDFGFwUy20TWsQ2iW2oBS4jUBKIkkummkim0hg8umJCix5Vy0kkJw0+gMX2lxGm5HIVCFqBFuvFkqIIaIYfIOr1BvNxtY6yR5uSEgMmX00g0L0kWnO1m0xO0WiIeg09TkTAUnvcym8NMwEDgwhD2YSWzzqTU9isqiYDeL+w0ckuxOtTCIbiqZex7nt2mD3MCZEo-eRFtEEje1jtthdI+k2gJlmr1is5IbCl0LvtlS38raRFl0pZ+9zqIknIWS4noagtm82iSMYZhooWE4ZAG9qSKWH5qgyqq9CyoITBAUwzHMizLP+g6AfUByqNIlgNpiugIdYxJqMWdYIXsTzHHUexofS37-JhCogsqnK-hqWokSilqIEoBy6KB2IQVe0EetBRAjnsdjNpe6Tcb8SZgOG4mHlaM73OOk4aNOs5VrBJSGPI+z1GWUHgTRHaeEAA */
    id: "announcer",
    initial: "idle",
    context: {
      announcements: {},
    },
    states: {
      idle: {
        on: {
          announce: {
            target: "get announcement",
            actions: "assignProps",
          },

          speak: "tell",
        },

        description: `Machine only waits for announce messages`,
      },

      "get announcement": {
        states: {
          "validate request": {
            always: [
              {
                target: "load announcement text",
                cond: "intro does not exist",
              },
              "#announcer.idle",
            ],
          },

          "load announcement text": {
            invoke: {
              src: "loadIntroduction",
              onDone: {
                target: "#announcer.idle",
                actions: "assignIntro",
              },
            },
          },
        },

        initial: "validate request",
      },

      tell: {
        description: `Speak the first into as a test`,

        invoke: {
          src: "introduceTrack",
          onDone: "idle",
        },
      },
    },
  },
  {
    actions: {
      assignProps: assign((_, event) => ({
        title: event.title,
        artist: event.artist,
        upcoming: event.upcoming,
      })),
      assignIntro: assign((context, event) => ({
        announcements: {
          ...context.announcements,
          [context.title]: event.data,
        },
      })),
    },
    guards: {
      "intro does not exist": (context) =>
        !context.announcements[context.title],
    },
  }
);

export const useAnnouncer = () => {
  const [state, send] = useMachine(announcerMachine, {
    services: {
      introduceTrack: async (context) => {
        alert(Object.values(context.announcements)[0].Introduction);
        !!Object.values(context.announcements).length &&
          speakText(Object.values(context.announcements)[0].Introduction);
      },
      loadIntroduction: async (context) => {
        const { title, upcoming, artist } = context;
        const intro = await getIntro(title, artist, null, upcoming, "Milton");
        return intro;
      },
    },
  });

  return {
    state,
    send,
    states: announcerMachine.states,
    announce: (title, artist, upcoming = []) => {
      send({
        type: "announce",
        title,
        artist,
        upcoming,
      });
    },
  };
};
