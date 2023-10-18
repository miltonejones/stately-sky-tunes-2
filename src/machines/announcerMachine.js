import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { getIntro } from "../util/getIntro";
import { speakText } from "../util/speakText";
const announcerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMB2qD2BXVBjMATgHQCWEANmAMRqY74DaADALqKgAOGsJALiRlTsQAD0QBaAIwAmACxEA7NOUBWaQE4VADhVKAzJIA0IAJ4S9ANkUqLC2eot7pWyUwsWAvh+O1seQqQU1LAcYMgA1sxsSCBcPPyCwmII4u7qRHoKklpMOUyS6tIFxmYpkvJMekzSTLIKeuqZFkx2Xj7ofvjEZJREAO7IfCSoUFTkJLC8UcJxQ4kxyVLZRPY2WlrNss0tFiWI2npE6utaTnp6KtWt3iC+9AE9YEQcBBj4sDwjAATjkzQcoVQEGmMVmCSEC0Q6nKRBcSk0Klk1XUTBUewQGhUikkkgUFi2uMsSjatw6926QWer3enygPwmvCIMF4XwIYAAjlg4LwqBBBE9hgA3DDhJ53fwU3ovN5wWn0yZMsAstmc7kIIVvZDgqIgzjcOYQ0DJdbSDL5CyaPSyAxOBTonGnIgWdYKdSaaEGFok8VdQJS6my4Z036M5msjlcv6EV7EDjkLUAMwwBAAtkQfQ9KdKaUH5aGleHVZN1ahhbgtQJUDrWDN9eCkogLEUiDUtFk2yocQoXOiPbDJLZXVoUcdZJJvWSJX6ntnA98Q4rlRHuVQsBwIFqwLrYnXKw2END5CoVOpZM5LDb7OjO1oMm7co03doNBO6FPHlSZR9cwuw6gwCIPLbmCe6QhiyjYla3Znm6+LqL2MI2M6NQXE2sivp0mb+l+cq-gW-6AVQDCSNEerxKBRoSLIx5Os00jPtUOQOL2NgZBoGiVOc9EYeS06fjm84MkQgrIOMG68GAhaRkBNagru8yUQgSK3s69TnJc6jtuU6LuJIKydla5wWo0mQ8e+WYBt+gkKiJYmblJK7EaRO7kQpoiINaprVLaWjSFUeJbAhR7uAox6aBoWSeDcGaSk8uAABZgLg4RfEmBBfH0ybhERslkQa+7iAo9SKHiroDi4ji6DpuRHBYKgXJk5WhVF7Rvr6H4JUlKVpRlWVESRtauYa7kpN2hzSM6xw7CF9oaPIfmErobiSKZ0WTr6YYZimYCoIytlkPZKrSTlzkgW5yTlAoGQrStlhqN2zS7KYEjOHp1FZAYRT1JU45rW1ASbetYDbbtwmiQdEkOX8TmDflYGEmxTCaYOnbQWiz1lHp3bVDIkiXOUaj1WZG0FltO2MuQGDIBAXxk7tXwSYRfL-qQpYimKQPEID-0gxTVM03TLKM7wJZlhWgjVqd8nDckqzYgOY6uL51HSOi4gXC2Nh2IUbh6FoshIi1pL-cQEnkOQvL8qzwqiumnNEGb5Ci5q2qsMB0sFW2TBEAU0gKPkc21HoasyEQ9X5CauNOM6UU3JgEBwMIMWw-WYHiNCt6+-7MinkHauyL5LYtK4nZunrLjE1hYApxRI3iKcekTcOOR4jNGMDocWS4hsRluEUWiV7F-SDPwIw1+dVFVEcSihTo+K5IisjVVYWT1RYOJ+-i9iD3xs5WcGDLjzLiC4vIH11PrGgOFeGPWt7w4ouvXdIvU6F-ZhQ977hQlhkd3JH-ufEhwpqXGPJUGCS8Mb4lNAUFalQainhqNIHeH4v4-h-vhACvAAFgQmldJ+y1dJOA0E9UoDorDlAKKiJsro1IoIsjhdBNlwbiUkn-SYODFLKFvMQnQvkN5jmojpE8RcVqXGxv7Zw9DeidWSqlZMvUCDhE4XXIqt5qL4n4aiKozp0QGHUXrJwNgcTr2HDvbmmFeYqMWNkLE1QLRyFyEUeqxw1YNDPsXSodV6IDkROY0mQNeZgzspDdh2C5JDQKitK69jCjKWcQ0LQatzyKGLn5HIdVzjqH8SyQWRBKbU1poE8mDMsHWI8oXFCeIGj+wbnaDG6sWhFyyF4wmvi36tQ-g7MA5tymjWOIoOobocinCcOsNxEFNBd1MbUJgOwvBeCAA */
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
