import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { getIntro } from "../util/getIntro";
import { speakText } from "../util/speakText";
const announcerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMB2qD2BXVBjMATgHQCWEANmAMRqY74DaADALqKgAOGsJALiRlTsQAD0QBaACwBWABxEAbJMkBmWQHYAjAs0BOJuukKANCACeiaeqIAmBfqYLZS6Tbc3pAX0+na2PISkFNSwHGDIANbMbEggXDz8gsJiCOKympJE6rqyKsqaKupMurqmFgjZRCXSVja6eW666rLevuj++MRklEQA7sh8JKhQVOQksLzRwvGDSbEp4moKVTayTLLOCgoqNoVllrlVG+rqOiWyulutIH70gd1gRBwEGPiwPMMABGMTNBxhqAgU1iM0SQnmiB00iITE0TBsmkRMkk9Vk+wQdU0tkcOh0bkkbhUCmutwCXWCTxebw+UG+414RBgvE+BDAAEcsHBeFQIIJHkMAG4YCKPUmdII9Z6vOA0ukTRlgZmsjlchCC17IMHRYGcbizcGgFLSSTyXQ2AyOLTqBEqaToxEKaFbWTmoyI6QqDIk9p3cmSqkyoa0n4Mpks9mc36EF7EDjkTUAMwwBAAtkQxfcKVLqUG5aHFeGVRM1aghbhNQJUNrWNM9WDkogbKciMbJNsnExlHYVOjTroqppVlsTR7DN66GSJY9s4GviGFczUGARNydXE65WG6lEUxFApDIVzetETle9tFNImtImJeLnVxx1M-7pe9c-Ow0uV1QGJoYrqEpuEKpEYKhZLk6TnIidRouYiDpFi+5qHkRKSEweSSA+vpTpSL6yvOArIGMECamAhaRquNYghucyGogcK7kUxpFPYnYqOs6jokooGqAYkhwoO5pOJhk4PDhOZzvSRAEURJFkVy36-rWAE0aIdE2JknYZG4xoepouQcbBCAXMsxq4no6iemaNjCeKom4AAFmAuARJ8SYEJ8vTJhE36Uf++pbuIJygSc+66No6TbFYnHrFUjq2oU4WGMSPg3D6IkUg5TkuW5HleQpf7rspBqqakzSgXYFxrKcWwGeUg66JkuyaBZViOAU6g2YEYYZimYCoAy0lkLJyrkT5BWgoBtEIIOaFEJ681Eq4zQmIZtrLNacg1PusL6ESnXEN1aX4L1-VSYRQ28KRI3yT+43UcVKRmv2yJQupNUlOia1ZB4shbUUehoclbQTuKh0g2AJ0MuQGDIBAnw9X1zKXV+vJLqQpbCqKR1dQWCOndDsPw9jkOfMjvAlmWFaCNWd1FVuYWgZpkjZNabZ6Oi15YhosgmoYDWYko+1EJd5DkDyfLo0KIrptjxAi+QFMalqrBrhNKkLPxyzbCoDU1Fo6Tqei6RECietMGhJSOkDqXg3604Bq+EnymG12-FgHDEZdqv3VuchYs1PM6xZ1qaJeHPm3NzSm3xORocz3gpZgEBwMIGYEEp-lAeIO7QsoFmdgznoKDY6KLLsJvF80g4hQ1odCw8Gf1lncJWCbzNsSiBRFyXhmh-2gnFyoOv1Nezj1xS-SDMMjeTSV4gev2xTbPiBKnOzhkKI4WShzsg56Z26gYSlafYTOjvBvSM-qxIofyDVo5HvBp6GXxNhENzbaWmVOnj8+4kX87AsrteBXweogIe0JdCuA2LaLQfFYScXUkQZqForKXFQi0Y+stT4OzwpJD8y4QFUTplnR0WRthmnsC4S4od7ThWQTaB0Jo9BqF-vbXCb5JKDU9ldCMXJQEBRbjCP2HcMj7lOD2DefFkFVSMGsYouwj7A0fHbIgmVnKuWTLlAgEQBHN3Ns9duBcu7aE0NFdaO8EQIjWMzJRNsVELiJuDSGeippIkamhCRTR1ielqogQwthshrHUgbPQHohZg0fJDM6MlLpyQmK4kqAk36GB5mI9Yyg9i92LlkFmbEUJqGWhE3GxNEZEAJnDPGSNCGJJSCeN+5pCgUKKLkZq6IUT9k3tedSWg7D1GtifeWtSJANWWKoLp7cnB6BguUcQuxIGVzbB6WoOgVAJ08EAA */
    id: "announcer",
    initial: "idle",
    context: {
      announcements: {},
      work_index: 0,
      items: [],
      announcementText: "",
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

        states: {
          waiting: {
            on: {
              list: {
                target: "processing list",
                actions: "assignList",
              },
            },
          },

          "processing list": {
            states: {
              "get request": {
                invoke: {
                  src: "loadIntroduction",

                  onDone: {
                    target: "get next",
                    actions: ["assignIntro", "incrementWork"],
                  },

                  onError: {
                    target: "get next",
                    actions: "incrementWork",
                  },
                },

                description: `Load introduction for current title and artist from the ChatGPT API`,

                on: {
                  update: {
                    target: "get request",
                    internal: true,
                    actions: "updateText",
                  },
                },
              },

              "get next": {
                always: [
                  {
                    target: "validate request",
                    cond: "more requests",
                    actions: "assignCurrent",
                  },
                  "#announcer.idle.waiting",
                ],

                description: `Get next request until work_index maxes out. Ignore any errors and keep going.`,
              },

              "validate request": {
                always: [
                  {
                    target: "get request",
                    cond: "intro does not exist",
                  },
                  {
                    target: "get next",
                    actions: "incrementWork",
                  },
                ],
              },
            },

            initial: "get next",

            on: {
              append: {
                target: "processing list",
                internal: true,
                actions: "appendList",
              },
            },
          },

          "check for work": {
            always: [
              {
                target: "waiting",
                cond: "is idle",
              },
              "processing list",
            ],
          },
        },

        initial: "check for work",
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
      appendList: assign((context, event) => ({
        items: context.items.concat(event.items),
      })),
      assignList: assign((_, event) => ({
        items: event.items,
        work_index: 0,
        progress: 1,
        announcementText: "",
      })),
      incrementWork: assign((context) => ({
        work_index: context.work_index + 1,
        progress: 100 * ((context.work_index + 1) / context.items.length),
        announcementText: "",
      })),
      updateText: assign((_, event) => ({
        announcementText: event.text,
      })),
      assignProps: assign((_, event) => ({
        title: event.title,
        artist: event.artist,
        upcoming: event.upcoming,
      })),
      assignCurrent: assign((context, event) => ({
        title: context.items[context.work_index].title,
        artist: context.items[context.work_index].artist,
        upcoming: context.items[context.work_index].upcoming,
      })),
      assignIntro: assign((context, event) => ({
        title: null,
        announcements: {
          ...context.announcements,
          [context.title]: event.data,
        },
      })),
    },
    guards: {
      "more requests": (context) => context.work_index < context.items.length,
      "is idle": (context) => !context.work_index,
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
        const intro = await getIntro(
          title,
          artist,
          (value) => {
            const text = value
              .replace("Introduction", "")
              .replace(/{/g, "")
              .replace(/"/g, "")
              .replace(/:/g, "")
              .replace(/\n/g, "");
            send({
              type: "update",
              text,
            });
          },

          upcoming,
          "Milton"
        );

        console.log({ intro });
        return intro;
      },
    },
  });

  return {
    state,
    send,
    states: announcerMachine.states,
    contains: (title) => !!state.context.announcements[title],
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
