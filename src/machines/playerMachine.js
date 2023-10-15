import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { AudioConnector, frameLooper } from "./eq";
import moment from "moment";
import { getIntro } from "../util/getIntro";
import { speakText } from "../util/speakText";
import { useAnnouncer } from "./announcerMachine";

const connector = new AudioConnector();

const playerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYjSwG0AGAXURQHtYBLAF1qoDtKQAPRAFi5IDouATgBMJAMwAOAOwSArIK7CxAGhCZEAWgCMW4cL7DBWiXrEA2KSVmyAvjdWFsOPqiroIAAgC26AMYALWmYwPlh6dBx6D0dcDyCw9GZfMDwIFhCggDcqAGsQmOdXd28-QODQ8MjojCc45gSksAQsql90RhZSMi62ZBoGJlYkDk0tEgk+QRkzKbFzOeEzM1V1BG1ZCTE+MwkSJUUuHbFBMTsHGtwXN08fAKCQos8wAEcAV3RUWgAvXFT0vhaeT4BSuxVuZQe1w8L3enx+OGazGybQ6zC6PWGfToqLYnAQi1kfCkUimsjEPEEFikhxWo2OWykWlJXHJZKkwjOIBBjiCUDwYSoyAx1Gxg1xiDGfFkuhI4yksikkmkZhUalGWjEhOlmxOxkEJnlnO5NV5-LAYBywq5-RxwzxxnkROMS12gkpwi4Ulpax2E2E1P2JCM0kkRouzh5zD5AGEAPKxgBKABEAMpWrEDFjihDGMRaPjHeUqz0a9myb0aLg6AuUjX6jUhrRhrCXSN8uioMCNdM2sV2iVyKR8WXE-1iPZaWQ7CtKLb+8YKWQkCxCaTNpzAk1RvDxXD0HuirP9nNyCaMiQ7I6UqTTtVrHgGQyyHjSqxmZfr1tbqAVCJRNt8DAUSJMwVCvI0XjMPQfzlIC+ThpuWC8r+VQAUBHggWBEFQYiyLtIM6LkL0vZHqAeKVpOw6DpSOzPmYixcBWihEoYZiHMIEiCEu+o8J+Ebfih-4CehmHgckkHQWksFIrk8EtvxSFRoJ1SKT+InMKBYlgBJuGtPhnTkEQWgUJiJFDGREoatsQbCLmogkLwWgVmIQ4ep6z57CYtkSBIfGIZgyEJKhAlBcBrwQEwMEZDJQLGqpykAaFGHhUwukogRhlEaZh7mSMCCyP62zCPIOwnEoTLLHehhbEs8o6BsQZcLspz2FyCGJZUQnxUl6ApVQeC4DgVAKfQABmw1eP5X7dZ1KkBUpPV9Wl+loplJkipmuX2pxBbyB6T4bHmwjeq+kw6jIoiGJYLJ+R1f5zYFyBgOgOR1PQQ1RQCMVyRud3Bd1T0vW9Q3LaihHrdaOXZhouxErsTLWC5mqTuWVUnNsFjSpOrpNeIt0hbNAGjUETzsLQYS8hhGlYeJUGfXBU0KfNP5JUTJPQmTFNRlTmnYfQoMZd0WUbbaFlrLs-CSG6lLjpIvCVas-pnoYPl5pY+3PvjM33WzzCk+TjDc6JfP099jP+YFhMCcTescwblPG7T-MtOlBndMZxFQ8eMOSsuiqTiSJyeqqqxaEIfBaJYyonG6cyhq1cXMxb3NBNEQ1QDgcCwHgAAKCaxgA4gmACiKZpsLkObdmugegYTI3mxl5uhI3psfoeZByY9ImFwWtJ22dRp1QGdZ6EYBRK8yAeME7BRO9fg5Kb2Sxe1AkD6nyDp5nsCwGPE9TzPc84AvAtuweVfHjojIGIq4hMsV5heneihanmnErsSnocgnq-xevzBDxHjvfyAAjBeBBeqwDAOfUWeUJDhwcnoGQeppSKlbkoPgnEdCCAXGYScxU+7IX-oA7eu9HBgN8IvYuAA5JMMC+xixMPwZqTDZbFRZBWPaN8TAxwKlMIwhClLr1gNESBkA8Db1eF4aBFcMywLxCIfMjICqmA9EuJ+qx-aYLzNgy8VZFCCJ-PPSh0I9biPYAkegIR0CjSsTgAAFEuEgABKAgv8k7GNel2CAkB6GkTyhoQwUoDhVjzLwRGXBUarA0JIQkSx6LEkkJOQ4TYf7yWTkY4+JjvHmMsdY2xuBHGylcYnZCnjTE+IgEZCGciGEBJ0GYSYSxjAkDGMVHiTk7ww1ru+SkBVFRsjsK1UCPj4CYnDJ7C+YttD+kaYcHiqCgzvwrEyMOBh6I8DGDwpcvk0kbkeCUO4wRJnyM0EoRplgyQXhVAqPB5gVkmAuRsngYh7KHDMH5A54J7gJXDHUBoyQTl1PIsYM8VhJBLE1DeDUCtRiKkEOsty0w5ibA+Xsy4XzSg-Mzu4VYItgWaAsAIXQ7JZnyHZCIFZxwuBEhZEyBYrSdifKhN88oByYQfG+LgIF-i8TtILGYKcEgSVsU2J06JAcJgOU2PAniE5e7oqZryHlW1Rh6AmPM+Biz9SUgrBYBFxIeEOSDG3QxvzVIquhjoWGmrImRyWbqrpdZhyCpkIoHyCgdAtXOOkv6XUk7qV5k7S13tpgRxLLoMOyiqycPzFOBUYctDFmXFqs1rMCb3V6hFKgIaxYOm2E4i8AdH4yG9LMgQU4hBTmJIKoQaarYA2eq9II70c3ZSmQE8kQ55Q3ngSyMkOCrBlpvBWtixww5NVeWSetOtrbszAJzQ2UAeY020lBXN9SNT6Ftdq5ZVUR2RLYs+awVaFBop9b9Ne35B6b2HqQjdeJEkRw1OOEkrJ3RlrwVKBUL9hVbsZGa4ht6gG7ygfvaeC6j4LwfRKOl2w+0Kh8pYLd3peD8DJKCt0U48zyEA9ejeW9R7kOg+205CATD5i9a+oOJVjp3npN+xUxU9gsiDnh1ScQRHIDERAGD5H0ZGHlBxGYrr5DehEI0iqixNjnjDoIM15Scm8dIwS-EhJ5jUjdGxa6+pOEzG-fa3QIg9hSDNYNYaHhQoOz6nxyOhJFErirIK98U5W4kilCrcYpYxgWCGTYIAA */
    id: "player",
    context: {
      trackList: [],
      trackIndex: 0,
      silent: true,
    },
    initial: "load machine",

    states: {
      "load machine": {
        states: {
          "start player instance": {
            invoke: {
              src: "initializePlayer",
              onDone: {
                target: "load equalizer",
                actions: "assignPlayer",
              },
            },
          },

          ready: {
            description: `Player is closed and empty`,
          },

          "load equalizer": {
            invoke: {
              src: "startEq",
              onDone: {
                target: "ready",
                actions: "assignAnalyser",
              },
            },
          },
        },

        initial: "start player instance",
      },

      playing: {
        states: {
          "start playing": {
            states: {
              "get announcemnt": {
                invoke: {
                  src: "loadIntroduction",
                  onDone: [
                    {
                      target: "speak intro",
                      actions: "assignIntro",
                      cond: "introduction present",
                    },
                    "start audio",
                  ],
                },
              },

              "start audio": {
                invoke: {
                  src: "startAudio",
                  onDone: "#player.playing.playing in progress",
                  onError: "#player.playing.error starting audio",
                },
              },

              "speak intro": {
                invoke: {
                  src: "introduceTrack",
                  onDone: "start audio",
                },
              },

              "find existing announcemnt": {
                invoke: {
                  src: "findAnnouncerIntro",
                  onDone: [
                    {
                      target: "speak intro",
                      cond: "event data not empty",
                      actions: "assignIntro",
                    },
                    "get announcemnt",
                  ],
                },
              },
            },

            initial: "find existing announcemnt",

            // on: {
            //   silence: {
            //     actions: "assignQuiet",
            //   },
            // },
          },

          "playing in progress": {
            description: `Player event has fired and the player is playing.`,

            // invoke: {
            //   src: "sendIntroSignal",
            // },

            states: {
              "set up next track": {
                invoke: {
                  src: "sendIntroSignal",
                  onDone: "playback",
                },
              },

              playback: {
                description: `Player can safely send and receive requests`,

                on: {
                  pause: {
                    target: "#player.playing.playing is paused",
                    actions: "pausePlayer",
                  },

                  END: {
                    target: "#player.playing.track ended",
                    actions: "advanceTrack",
                  },
                },
              },
            },

            initial: "set up next track",

            on: {
              PROGRESS: {
                actions: "assignProgressToContext",
                internal: true,
              },
            },
          },

          "playing is paused": {
            on: {
              resume: {
                target: "playing in progress.playback",
                actions: "resumePlayer",
              },
            },
          },

          "track ended": {
            after: {
              500: [
                {
                  target: "start playing",
                  cond: "more tracks",
                  actions: "updateCurrentTrack",
                },
                "#player.load machine",
              ],
            },
          },

          "error starting audio": {},
        },

        initial: "start playing",

        on: {
          stop: {
            target: "load machine.ready",
            actions: ["pausePlayer", "clearTrack"],
          },

          seek: {
            actions: "seekPlayer",
          },

          COORDS: {
            actions: "assignCoordsToContext",
          },

          silence: {
            actions: "assignQuiet",
            internal: true,
          },

          insert: {
            actions: "insertTrack",
            internal: true,
          },
        },
      },
    },

    on: {
      play: {
        target: ".playing",
        actions: ["assignTrack"],
      },
    },
  },
  {
    actions: {
      assignQuiet: assign((_, event) => {
        return { silent: event.silent };
      }),
      seekPlayer: assign((context, event) => {
        context.player.currentTime = context.player.duration * event.value;
      }),
      assignIntro: assign((_, event) => ({
        intro: event.data,
      })),
      assignPlayer: assign((_, event) => ({
        player: event.data,
      })),
      pausePlayer: assign((context) => {
        context.player.pause();
        return {
          paused: true,
        };
      }),
      resumePlayer: assign((context) => {
        context.player.play();
        return {
          paused: false,
        };
      }),
      clearTrack: assign({
        trackIndex: 0,
        trackList: [],
        track: null,
        src: null,
      }),
      insertTrack: assign((context, event) => {
        const { trackList, trackIndex } = context;
        trackList.splice(trackIndex + 1, 0, event.track);

        return {
          trackList,
        };
      }),
      advanceTrack: assign((context) => {
        const trackIndex = context.trackIndex + 1;
        // alert(trackIndex);
        return {
          trackIndex,
        };
      }),
      updateCurrentTrack: assign((context) => {
        const { trackList, trackIndex } = context;
        const track = trackList[trackIndex];
        console.log({ trackList, trackIndex, track });
        if (!track) return;
        return {
          track,
          src: playerUrl(track.FileKey),
        };
      }),
      assignTrack: assign((_, event) => ({
        track: event.track,
        trackList: event.trackList,
        trackIndex: event.trackList
          .map((track) => track.ID)
          .indexOf(event.track.ID),
        src: event.src,
      })),
      assignAnalyser: assign((_, event) => ({
        analyser: event.data,
      })),
      assignCoordsToContext: assign((context, event) => {
        return {
          coords: event.coords,
        };
      }),
      assignProgressToContext: assign((context, event) => {
        const { currentTime, duration } = event;
        const current_time_formatted = !currentTime
          ? "0:00"
          : moment.utc(currentTime * 1000).format("mm:ss");

        const duration_formatted = !duration
          ? "0:00"
          : moment.utc(duration * 1000).format("mm:ss");
        return {
          currentTime,
          current_time_formatted,
          duration_formatted,
          duration,
          progress: (currentTime / duration) * 100,
        };
      }),
      // assignProgress: assign((_, event) => ({
      //   currentTime: event.currentTime,
      //   duration: event.duration,
      // })),
    },
    guards: {
      "more tracks": (context) => context.trackIndex < context.trackList.length,
      "introduction present": (_, event) => !!event.data?.Introduction,
      "event data not empty": (_, event) => !!event.data,
    },
  }
);

const audio = new Audio();

export const usePlayer = () => {
  const announcer = useAnnouncer();
  const [state, send] = useMachine(playerMachine, {
    services: {
      findAnnouncerIntro: async (context) => {
        const { announcements } = announcer.state.context;
        const { Title } = context.track;
        console.log({ announcements, Title, intro: announcements[Title] });
        return announcements[Title];
      },
      sendIntroSignal: async (context) => {
        const { trackList, trackIndex } = context;
        const track = trackList[trackIndex + 1];
        const upcomingTracks = trackList.slice(trackIndex + 1);
        if (!track) return;
        const { Title, artistName } = track;
        announcer.announce(Title, artistName, upcomingTracks);
      },
      loadIntroduction: async (context) => {
        const { track, trackList, trackIndex } = context;
        const { Title, artistName } = track;
        // alert(Title);
        const upcomingTracks = trackList.slice(trackIndex + 1);
        const intro = await getIntro(
          Title,
          artistName,
          null,
          upcomingTracks,
          "Milton"
        );
        console.log({ intro });
        return intro;
      },
      introduceTrack: async (context) => {
        speakText(context.intro.Introduction, true, "en-US", null, (value) => {
          if (context.player) {
            context.player.volume = !!value ? 0.5 : 1;
          }
          send({
            type: "silence",
            silent: !value,
          });
        });
      },
      initializePlayer: async (context) => {
        const { player } = context;
        if (player) {
          console.log({ player });
          alert("Player already attached!");
          return audio;
        }

        audio.addEventListener("ended", () => {
          send("END");
        });

        audio.addEventListener("error", () => {
          send("ERROR");
        });

        audio.addEventListener("timeupdate", () => {
          send({
            type: "PROGRESS",
            currentTime: audio.currentTime,
            duration: audio.duration,
          });
        });
        return audio;
      },

      startEq: async () => {
        const { analyser } = connector.connect(audio);
        if (!analyser) {
          return false;
        }
        frameLooper(analyser, (coords) => {
          send({
            type: "COORDS",
            coords,
          });
        });
        return analyser;
      },

      startAudio: async (context) => {
        try {
          context.player.src = context.src;
          context.player.play();
          // alert("played??");
          return context.player;
        } catch (e) {
          throw new Error(e);
        }
      },
    },
  });

  return {
    state,
    send,
    states: playerMachine.states,
    announcer,
    play: (track, trackList) => {
      send({
        type: "play",
        track,
        trackList,
        src: playerUrl(track.FileKey),
      });
    },
  };
};

export const CLOUD_FRONT_URL = "https://s3.amazonaws.com/box.import/";
function playerUrl(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}
