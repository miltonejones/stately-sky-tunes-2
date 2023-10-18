import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { AudioConnector, frameLooper } from "./eq";
import moment from "moment";
import { getIntro } from "../util/getIntro";
import { speakText } from "../util/speakText";
import { useAnnouncer } from "./announcerMachine";
import { getLocalSetting } from "../util/getLocalSetting";
import { setLocalSettings } from "../util/setLocalSettings";
import { getRandomBoolean } from "../util/getRandomBoolean";

const connector = new AudioConnector();

const playerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYljABcACAe2SIEsyA7AbQAYBdRFM2K6utkAD0QAmABwAWAJwA6AOzjGwwYxEA2AIyCAzMoA0ITIgC0AVhEzBo1eOHLhwxkemCAvk91osuPO8xNWSEMgcXDS0vAIIqqJRksqiyuKqltKJqva6+ggGkYLKkozK9soaRlpGRsoubhjYOJKoZOgQJAC26ADGABZUtGCSsEToOKTeuCTd-ei0bWB4EHS93QBuZADWvSO19Y0t7V09fQNDJBtjtBNTYAhLZG3o3AwsvryBnPdhQhKSGhrScYKCv0ERjEOj0hkUjGkkhK9kY4iMojE9mklQC1VwdQaTVanW6vS2TTAAEcAK7oVBUABenjm+2ua0kG0x2xxe3xWJIxLJFOpOCutGWt3uvie-hewR4-nCWQKeSMqlKRRKCsYGnShlU8VUX1U5Uick0-yMqKZBJ2uP2nTAbRWx3ROBIy1QJOaM1F7FeIXemXUGi+GiB4hUAfhlnVmUEqW1OUR0mEiTkPxN9sZ1W6UAIRAo7oCQTeUsMGm1CThcksSVE8lBGSyqVy5UcAbU0iKog0yY8tW86YIYDAKxz4vzoHCmjhkn+QLhCtE4cswhkhTi5SUyk0wg7NVTWB7AGEAPL7gBKABEAMqDvNegsIQ1GSQG1TJRGxrThgyif6L+MAgqREqiJuGLdrQGacKgYAXJenqSiOQhFqIMTCBoUTiJWUSiNI76RowD7xgG6gOIwfwVK4aKdtumA9uMuBENBEqhDe-y-JIqjIYI4hoXGBFqmCEaIf8yglOI3xxg4FhAV2aagXg9QkhAuD0cO-DwbqkgSEYViKHEUS-OGn5+qIRjTpoTaaYBZFMiBUAHIMwzSTZMCkJMtBkCSFzNLQRCzPMkj0usKbWbZRxBU5JAuW5Hlefygp3CEIosM8V6wSpmTyve8iaQUxGRjkqjvo4D6wgC8ZyL8G6WYFDnBfZO6gZIYURe50yed5tILAKqwBRRQUTCF1WNbQrnNWArUxTccV0CKqh+B6DHegY5jQkZkTCNIcLfAk0i8TWQnqbq1jiGoxRaGokmUemNV2nVjnEOFQ2RS1Xl4LgOBkFJdwAGbvc0lHAdVfW1VR9WDcNUVEONQrxY8iVisljFwRGqR+owjCasoahiEGs58QY60TvG5QGfCHGaedvWHEDl2g49o3PSSyAQHcYBKdeiNZKjKMwhoaFyOIshGNhiiscuFjFEoDiqOTAOU9dwM2YD4XyTQPl0p1DJWTLdly5divoMrZCQ5NDzMKzKXhCYUJrllwgiZoljVkI20xPOPPIQGmnOJVPVa-1N1XfrEAq6973bkQ304L9mv+4rFPa4HNBG8KMOzbmMEI6lbFSMUCQaHY0glEWel8Y4iEoRCcQJGxEjSzHsu9cgYDoLa3REG9qsdcsGtVXX2sN03LdeW9SfQ6bsNzcp0rqNqaOVj8DjKNIz5YXxKgPpjyTmKkum1-LV1BZ93SEnwVD9Om91g09bW+f5f0fXvsfVYftDH6f1CgRftNjdcUNTSnSXpwWokYEeQ1zCDKAZHmO0hB2BiKqOIGh7DWCXsab2W445+z3s-V+Z8P5NXBh3Py6turoN9lTeq2DOQn1wVAT+I1v6dV-ibegM0AHzRvLWTQ6kYSWHhGuHI4g5xtgfFEEw2U2J2C9lUH2vdMGXStDaEgtwFIXDwGbDOU9bBl04v8YiwCHDQIQCYQQrFkLqByMUIEkRd663rtVBRtplGQWmGo1hcNAE3kSCY22shzAFE0PEcw4ZjK5D+PzWQaN5RSPIqQ-21lTjHDelAHAcBYB4AAApHn3AAcSPAAUTPBecead2GI3MQJJIGM4iHSsOGWIJiiwiURJoESCgLLSNiXveJ3RElkGSakvAWYoBQAguo70T4nysU0kXIoCQiZ1IsHKAia0pwJhsfVbptBen9NgLAPod0GYkB6HwUgbd2grEIbfaOXSHIJOQEklJuz9mkEOcc05OBzkjz-mPVOQ42aZ3+H6b4szEF5wsTjDIn57zKnAXqKc5R1k2U2dsx5ezvAACNzleH1oQMZN5wELmImVLK5cRB1PKJIOwAZlx5zQihRFF0P49PuX01FlFMU2jwHkgAciePFiMRK4XsJWBEWoBaO0yHnP020joiCbEg9pMT-pxNucyh5qT2VYp5XytxE9-nhFSGtSlshEgESMi2YQ75sh+hKM+I0QILAVQ6cqm5N07nqqeRirFmS8kADUACS+4ACqRTfnw29FS6EVcohFlhN8K1soRBrUrCCDi8QGXIpZTsvZDiSAR3CkMN+ajil-PNogXUkz1qcR+OoKw8oJVPhRhxSEqoFQKCEoq65l1M0epzR0a0tp812SLSwsNHiykImztYISIkCi0sMSIKEyQ2IYz4dPVBzr77dtVVsrNbLCAvwLdQfoJBOBQFoOSS5xC76MqRTulFGqD1NGHSes9F7UBfOYSW8NnifwPnSkCLQbY6z6UmYg7amE2xGXMCiNBLrt1utPscHFkA8CPJdCzb947UpHQXCkNi65-gSEtSXTCUbHAAgSDpREDKzmKMggpCAeA+ATCIL0dAn02M4AABTGUYAASi8D3PedHbQMcgPy1KBgeYmNRplW2uc2wiQKostacmsrygSOIWjHz6Mv1QyxgYbHJAca47x1Ggmu31VE5yfTEBR1sMnoWfIlK1w53CfGawEKNTyGzk+XRYtdS-AZY-f2NN6HPRDh9cOP0b0YPIbdZyD0IsQx-sbaaY7SmpW0twoothVRlHWt5yVsQXacV1GoAoJqXBkVcgpeAYp7SOf1eCGDeQ0YY0xhIIJuNzC20paWReBEDSkU3cybEuw8TNbLRGWBQkFSNvkITfKvXKwNNSMROwhQHbnTNKyPE+97SnHONMabGjwQBhiPKIuiDbAVqtZxKQCQASEQLlU3bHJ9v7BSY0DIeqZtZDI-lysNgog-hIzWSIaN1KIndhjVGz4Psskm-sM0XJyRUlwGd70yQ8iWE0xYIEmlZAJpbNCUy+pDXxFg2NvbKPei5pOE6DD2OOFPikPGeIlYgxAmsGxIW+NEGcVtnnIyUREWs-ZpGTi7X0Zdexu+Nafo1OozafzEmIW7E3Ul1JyM8pZedergr3GEhchqCsFYJQRZbA06VVu+qoW97hfBjrqe8guZGWnYa1IgtcbxHXkvLxsQbDJCdXb29h3ZHOQNq78tmovjykrC2URWUJWGlc1Yb41S5UiE133AGjdm6nDbmQWPmREQ2srmja3bZTLhj8RORIybNR-EiKN8P8WdYUKPlQt+598FXzL4tKsZgfhQMUKJFeGRzAmJEmhZCCJ8iCTz3I+quanEXCH4oRIMQUKImBAUQ64YWxSAsJ1pQAJtrbQzfevdqSy+yEQkoC1mhieWEEHOXCvxBVNkC3nDdHe1UParKj6ByyARyYAJyJAomZeuo0OyQCIJgs6jgtg4YouMgnmJgbYJQBQABVmd6iGu6vamqNoZeYgsmv4CgOcyQQYaBIk0IBiUqCgESYe+Bt67qIBTyuaQ6ha-QsBmofovOHsR0XiPWGQq05OZURQFifM7ebBwB2a+yh6L6pAb65IsBcYuQ28JgWg8gaMYh5an4Mg3WuGAIIgAIN+iGsAyGJIhAEAZB9BW0Jgh0QkBcgifEQYWhsqNgNa8YNccG9uNkNm4m9h7iWW4QQkuQ8guoJgyMVguo74xQ2ojYKE60KCS83wDKUWp6lM-eMeYRTmEQ1g0ItsDg4kcIm8U+iAVcrEb2Hai8mo8YNWTgQAA */
    id: "player",
    context: {
      trackList: [],
      trackIndex: 0,
      silent: true,
      shuffle: false,
      repeat: true,
      volume: 1,
      options: 47,
      cadence: 0.3,
      language: "en-US",
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

            description: `Load the audio player into the machine context.`,
          },

          ready: {
            description: `Player is closed and empty but ready to play.`,
          },

          "load equalizer": {
            invoke: {
              src: "startEq",
              onDone: {
                target: "ready",
                actions: "assignAnalyser",
              },
            },

            description: `Attach the sound analyser engine to the audio player.`,
          },

          "check player volume": {
            entry: ["initVolume", "assignStoredProps"],

            always: "start player instance",
          },
        },

        initial: "check player volume",
        description: `Initialize media player components.`,
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
                      description: `Intro was successfully generated`,
                    },
                    {
                      target: "start audio",
                      description: `No introduction was generated due to an error or something else.`,
                    },
                  ],

                  onError: [
                    {
                      target: "find existing announcemnt",
                      cond: "can retry",
                      actions: "iterateRetries",
                    },
                    "start audio",
                  ],
                },

                description: `Generate a fresh intro from ChatGPT`,

                on: {
                  update: {
                    actions: [
                      "assignIntro",
                      assign({
                        silent: false,
                      }),
                    ],
                  },
                },
              },

              "start audio": {
                invoke: {
                  src: "startAudio",
                  onDone: "#player.playing.playing in progress",
                  onError: "#player.playing.error starting audio",
                },

                description: `Send explicit play command to audio player.`,
              },

              "speak intro": {
                invoke: {
                  src: "introduceTrack",
                  onDone: "start audio",
                },

                description: `Speak the intro using the local voice engine.`,
              },

              "find existing announcemnt": {
                invoke: {
                  src: "findAnnouncerIntro",
                  onDone: [
                    {
                      target: "speak intro",
                      cond: "event data not empty",
                      actions: "assignIntro",
                      description: `Existing intro was found.`,
                    },
                    {
                      target: "get announcemnt",
                      description: `No existing intro was found.`,
                    },
                  ],
                },

                description: `Look for an announcement that has already been stored by the announcer machine.`,
              },

              "check cadence": {
                description: `Check announcer frequency option to see if an intro should be made at all.`,

                always: [
                  {
                    target: "find existing announcemnt",
                    cond: "announcer should talk",
                    actions: "initRetries",
                  },
                  "start audio",
                ],
              },
            },

            // on: {
            //   silence: {
            //     actions: "assignQuiet",
            //   },
            // },
            initial: "check cadence",

            description: `Player begins gathering information for this track.`,
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

                description: `Load introduction for the next track.`,
              },

              playback: {
                description: `Player can safely send and receive requests`,

                on: {
                  pause: {
                    target: "#player.playing.playing is paused",
                    actions: "pausePlayer",
                  },

                  END: [
                    {
                      target: "#player.playing.track ended",
                      actions: "advanceTrack",
                      description: `Track has ended or user has selected the next track.`,
                      cond: "repeat is on",
                    },
                    {
                      target: "#player.load machine.ready",
                      actions: ["pausePlayer", "clearTrack"],
                    },
                  ],

                  PREVIOUS: {
                    target: "#player.playing.track ended",
                    actions: "rewindTrack",
                  },
                },
              },

              "check for artist": {
                always: [
                  {
                    target: "send artist signal",
                    cond: "track has an artist",
                  },
                  "set up next track",
                ],

                description: `Check if there is an artist listed for this track.`,
              },

              "send artist signal": {
                invoke: {
                  src: "sendArtistSignal",
                  onDone: "set up next track",
                },

                description: `Send signal to update artist hero image`,
              },
            },

            initial: "check for artist",

            on: {
              PROGRESS: {
                actions: "assignProgressToContext",
                description: `Player reports current player position to the UI.`,
              },

              toggle: {
                target: "playing in progress",
                internal: true,
                description: `Toggle a boolean setting on the player`,
                actions: "toggleProp",
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
                  description: `If there are more tracks, iterate the track index and return to playing state.`,
                },
                {
                  target: "#player.load machine",
                  actions: ["pausePlayer", "clearTrack"],
                },
              ],
            },

            description: `Move to next track if there is one.`,
          },

          "error starting audio": {},
        },

        initial: "start playing",

        on: {
          stop: {
            target: "load machine.ready",
            actions: ["pausePlayer", "clearTrack"],
            description: `Stop player and clear current track from memory.`,
          },

          seek: {
            actions: "seekPlayer",
            description: `Change the position of the current track.`,
          },

          COORDS: {
            actions: "assignCoordsToContext",
            description: `Sends coordinates to the equalizer.`,
          },

          silence: {
            actions: "assignQuiet",
            description: `Opens/closes the announcer snackbar.`,
          },

          insert: {
            actions: "insertTrack",
            description: `Adds a track to the queue after the currently playing one.`,
          },

          louder: {
            actions: "assignVolume",
            description: `User changes the volume of the player`,
          },
        },

        description: `An audio track is currently loaded.`,
      },
    },

    on: {
      "set option": {
        actions: "applyChanges",
        description: `Change a persistent player option`,
      },
      play: {
        target: ".playing",
        actions: ["assignTrack"],
        description: `User clicks play on a track in the UI.`,
      },
    },
  },
  {
    actions: {
      applyChanges: assign((_, event) => {
        setLocalSettings(event.name, event.value);
        return {
          [event.name]: event.value,
        };
      }),

      assignStoredProps: assign((context) => ({
        options: getLocalSetting("options") || context.options,
        cadence: getLocalSetting("cadence") || context.cadence,
        voice: getLocalSetting("voice") || context.voice,
        language: getLocalSetting("language") || context.language,
      })),
      initRetries: assign({ retries: 0 }),
      iterateRetries: assign((context) => ({ retries: context.retries + 1 })),
      assignQuiet: assign((_, event) => {
        return { silent: event.silent };
      }),
      toggleProp: assign((context, event) => {
        return { [event.prop]: !context[event.prop] };
      }),
      seekPlayer: assign((context, event) => {
        context.player.currentTime = context.player.duration * event.value;
      }),
      assignIntro: assign((_, event) => ({
        intro: event.data,
      })),
      assignPlayer: assign((context, event) => {
        const player = event.data;
        player.volume = context.volume;
        return {
          player,
        };
      }),
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
      initVolume: assign({
        volume: Number(localStorage.getItem("player-volume") || 1),
      }),
      assignVolume: assign((context, event) => {
        context.player.volume = event.volume;
        localStorage.setItem("player-volume", event.volume);
        return {
          volume: event.volume,
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
      advanceTrack: assign((context) => ({
        trackIndex: context.shuffle
          ? Math.floor(Math.random() * context.trackList.length)
          : context.trackIndex + 1,
      })),
      rewindTrack: assign((context) => ({
        trackIndex: context.trackIndex - 1,
      })),
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
    },
    guards: {
      "can retry": (context) => context.retries < 3,
      "announcer should talk": (context) => getRandomBoolean(context.cadence),
      "repeat is on": (context) => context.repeat,
      "more tracks": (context) => context.trackIndex < context.trackList.length,
      "introduction present": (_, event) => !!event.data?.Introduction,
      "event data not empty": (_, event) => !!event.data,
      "track has an artist": (context) => !!context.track.artistFk,
    },
  }
);

const audio = new Audio();

export const usePlayer = (artisan) => {
  const announcer = useAnnouncer();
  const [state, send] = useMachine(playerMachine, {
    services: {
      sendArtistSignal: async (context) => {
        artisan.send({
          type: "open",
          ID: context.track.artistFk,
        });
      },
      findAnnouncerIntro: async (context) => {
        const { announcements } = announcer.state.context;
        const { Title } = context.track;
        console.log({ announcements, Title, intro: announcements[Title] });
        return announcements[Title];
      },
      sendIntroSignal: async (context) => {
        const { trackList, trackIndex } = context;
        const track = trackList[trackIndex + 1];
        if (!track) return;
        const unannounced = trackList
          .slice(trackIndex + 1)
          .filter((track) => !announcer.contains(track.Title))
          .slice(0, 5);
        const event = announcer.state.can("append") ? "append" : "list";
        announcer.send({
          type: event,
          items: unannounced.map((item) => ({
            artist: item.artistName,
            title: item.Title,
            upcoming: [],
          })),
        });
      },

      loadIntroduction: async (context) => {
        const { track, trackList, trackIndex } = context;
        const { Title, artistName } = track;

        const upcomingTracks = trackList.slice(trackIndex + 1);

        const updateChat = (value) => {
          const text = value
            .replace("Introduction", "")
            .replace(/{/g, "")
            .replace(/"/g, "")
            .replace(/:/g, "")
            .replace(/\n/g, "");
          console.log({ text });
          send({
            type: "update",
            data: {
              Introduction: text,
            },
          });
        };

        const intro = await getIntro(
          Title,
          artistName,
          updateChat,
          upcomingTracks,
          "Milton",
          context.options
        );
        console.log({ intro });
        return intro;
      },

      introduceTrack: async (context) => {
        speakText(context.intro.Introduction, true, "en-US", null, (value) => {
          if (context.player) {
            context.player.volume = !!value ? 0.5 : context.volume;
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
    setOption: (name, value) => {
      send({
        type: "set option",
        name,
        value,
      });
    },
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
