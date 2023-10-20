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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYljABcACAe2SIEsyA7AbQAYBdRFM2K6utkAD0QAmABwAWAJwA6AOzjGwwYxEA2AIyCAzMoA0ITIgC0AVhEzBo1eOHLhwxkemCAvk91osuPO8xNWSEMgcXDS0vAIIqqJRksqiyuKqltKJqva6+ggGkYLKkozK9soaRlpGRsoubhjYOJKoZOgQJAC26ADGABZUtGCSsEToOKTeuCTd-ei0bWB4EHS93QBuZADWvSO19Y0t7V09fQNDJBtjtBNTYAhLZG3o3AwsvryBnPdhQhKSGhrScYKCv0ERjEOj0hkUjGkkhK9kY4iMojE9mklQC1VwdQaTVanW6vQmRxO4wGFzwuBwZFq7iIADNKc1JBtMdscXt8YdhuicKdztMrrRlrd7r4nv4XsEeP5wllpBpob9ZKlxKJ-pp0oZVMDRDJlPENIJlcp-j9UUyttjdnjmU0wABHACu6FQVAAXp45vtrmtGVzrTtcftzSQ7Y7nW6cPzBXcQiKWM8gm8pYgTJJhOpkhZzLLpMppOrMqoClCJBoJEoDeJpPJTb6g6yrZ0wG0VscuSRlqh7c0ZqL2K8Qu8C5ovvqjOIVPr4ZZ8wZBKlVJIcojpGnLIwTa40R4qdVulACEQKL2AgmB0nMhoFwk4XJLElRPJQRksqlcuVHPq1DnSxoa9ufVge4EGAYArMe4qJqA4SaHCi7-EYcKqKW+aWMIMiFHE5RKEaGjCH+NQAZgQEAMIAPKkQASgAIgAyuBp6SlBQijpIchzhmYjCLKT6GCqgjoWmAIFJEJSiPhGLeEBnCoGAFz0f2jH8MxkQxMIpYSA+USiHmYKZHOjCsWm+rqA4jB-BUm5MpJtD7uMuBEPJEqhOe-y-JIqhqRW2meUhM7mHByglOI3wrg4FjiTugE2Xg9T2hAuCOZBSkIJomqSBIY4KGZsTaaI+YqnKogIQkmifmOYmWb61lQAcgyclFNUwKQky0GQ9oXM0tBELM8ySF66xVbuNm1YSQ2NcQJAtW1HVdZGNzRnQsZ+H2TmDsYaXyGOBRmXOOSqDOjisbCAJpnIvx4ZV-7VSN9VEcNTWTbQrXtdMnXdR6CwCqsA1XWNN2tg1kgPVNL1gG9c1CjGjyqMtJ4Kc5TF6dqCJGJEXFwt8CSyjOgXpZq1jiGoxRaGoEWEXu-3XcDT3Ta9XVkjgFKRbS9KERJf0ErdFPU89M1EBDC0PMwiVnojWRqUYi4WLIon-PEPGZIdcgIRIVZwo4ypk9dnMA3d43NTToNvQzTMASzOAMlZHMcrr3MTSDfMC8K0OwxBovJYo2pFUUtjrmUVZ5bpBhaNqajiAk5SFpCCRa9bdW2-d9uG3zeD2sgEB3GAIuKdKqTrnkMIaMqciVvCfmKO5mEWMUSgOKoseAzr2s2+gcU0D1npfd6VuNzbzfx63EA0E7UPC3GYoMQjyUmFCRpbcIwWpYT+YAnKYdqVY3xAuODd65TcdHIP7fkpSZt0hbbORXvTcH81bdkCPi2POPK1JeEHlSMUCS4ZCJSXr8+ZHDalLBCOICQPISF3hTG+jdkBgHQC2boRAKQd0+ssbug1e7x21nAhBpxkEP2uJDJ+Y9XaTzWuoBcjBIjrmkA4XMGYdIZBUKxNQXF1AWDMtpKBw0YF7xpN0G0fAqD9D3I9XmdN3q9X6pfcmvC+5-QEbQIRIjqA2XEbTMGs0iGCyWvGeGFD8Z5CNMIMoBUi4aBXnYGI644gaHsNYaQdCeE1T4RTJRKjRHqIdpI1BfUu4-QIv3UagMPHBmEV4qAGijbaK+sQoW9AYb6NWueF8w4ir2MsPCI0ORxAoVEHKZURUciMGob7Zwl0gm3wTjVRszYSC3HiqSbOU9c7wmAQ+ccftZBOMDhkVGUIgq2BXHYOhRUXH70BnUlsjTZLTDwIkshBjzyJH4gvWQ5gCiaHiOYfMCFch-ErLIahqMKlVF+oDaqpxjgUigDgOAsA8AAAUKKkQAOIUQAKI0Toi-OGKTEaUMllWTepkEQKDybpJCRoviKAcD8BwZQAQTKud0G5ZA7kPLwIeKAUAZItMHKoRwUIfjqFLGUBCRKUJaH4vqZECK6EzxRWNa5yBbn3NgLAPoE004kB6HwUgyD2grD8TInue9UW0HRZizl3LSC8v5YKnAwrH4JL+W7HOiAkJFUXOUQmsQNYL3ykSr4kIgRaBzA4KwzKGqsvZQ8wiAAjYVeBPkADkqIEvPLYSWlgSm2BBJeBWxgxzQgxrtTimgbV6ztRijlXLvDOubK6j1izklvy1fIKEXFwHGSKjmYQM5shyhKBmeCQILAXXOVUy5LK0VsrjQ6xNLqXmfIAGoAElSIAFVflLIBclOwBlAr-BKtLQsM5SXuVkFYB8IgHAGmjWI+t9rZXTJIOfSaQxVELPVeQlZwJ+LBVRuuUqe1C26TUqmYyhZFTKhzCiSp7Na22pXY2tdHQmwtk3XVHdaaJ7LMBQUSWSLFCaErEaKxUJkgeV1NkoFS71FvplVywgyit3UH6CQTgUBaBOlFQE2R11JXSvjdy9Dv6sM4bw6gVVeiAMDvfgTdyRL8hIk1JmY1JLISll+OSrMEyhX1NkvFCAeA+ATCIL0dANIpM4AABQIUYAASi8JgveQmWwicgF6sWRd+KlM2gvb+BTgoHQsKmNW9hCaowSOIQTyrhPKMgOJyT0nZO4EU6U1T4qKaaeDM5iA-7X7u2lPY3I1hNBjiOWmawfSNTyE-kS-4ZkkKal+IhqJyGyPNuTXZIYunkqpAUGYEmFjw64SYYgNSBkci6iiMM0pURMuxpQ3KkgvL8tSaaJpgj6DAnPolXWqVDa2uEHlcgHk9lIAkE03R5+-aM0IEJsArN5hyzxDHPmKwaEtByHJWZAtLXstNuqEmlYl8xiwBqV4VuhBCvhGCmhXMYhv6BQYZCjI1cjp2CKHQyIuFArHZG6uhNZ3hWXZEccO7LmOVdiznuwDg7ojpjhNYMyT3BB7LnKxWzAPuJREfZuVq8V4Bii5Om0L4IYKldlIvdcPwqtI2CixriwJ3wNYqtWjEdZLQ9Ep5qvS1jAppdlPINMqM-IPklmwuhVhsg2F-E+zYWJ-RskmTUHkJJpgC9aeCfUMRUb-3sbYTU+0g5ZKkCVZIQI6H1bJrzgMvR7mNAyCFwXWRtKpjsA+GwDX1AXufDQhcDW1Ik1KRmB3qv6yBlVyGJ0rpcC68HFoVMIgI7jicZxfIRaVxSCUNkQmShkhR5ZHz3o66Tgdnh8n1JWT0ppkhHCM1thKzl1lDEDydDfh-c1BZbnV89y17FnOErH46d0pCkzgwXE5QEwq9QnIc5+9bhrdfBRDVh-JVnNq2nFjFBT5nBIXI6866OF9lW1fg3oEb73jzTRb0t+53kHKewRVrBqHkKkIwOMrcMNWbEDYMkJfr5vItgtUkfGQE-lqoWF8KjA+DmFEGUPqivAbgTGHnEAoJ5CAepjfuAbAvAogl1BSNAZkIiCWmAtQpeGIPqN8CvHEIuIkFxBYIAXOHEBMm4sNGEmABEmolEj4lokQKQbOI+HvvTofrpOYEekXOQQiPkHLBwbfhTOurMhcMIYoIkDEOpKYujgTIAvEHjLqFsgCNmErgPnIjVCRqNvGqQedO5ACGjgUCWAoDOAvDEC9rKHLKkGAsDqRg6uNh1pNoqrNo5isKQZqA4N7jeGOHTuVPmLhNqCuB5CYAUiUMBr4dYadlgOdrYYTPYSCujs4VjpIfkA3rhAiJQlWPEBkaDpIOuj+tuv0OEbtJ3mOGZBSgCCYHsp-DesUJ4YTB-jUe+qhiJhhqothlQLhk6OEaYpLD6vCMCLqLhFYPlLSr0QoEhOYAvCvqATVP5tphAKQbqJLFoLQW-n7gaAdMUF8LqIUBjrBvZsrhYZICfNyJzGIpATMW+AvIir8OrOmNtpoUSuUIFHEMkDYPXE8cRsNn4bKgEZ1mcNNj1qEeEdhIuOUZWPss3p9jAZ8MqGSmOAaIWA4EMW1rlhdkSNdtVKQTmtCMUEaGwmSj8PmHBl8DBvYg4FWIoDsbgcNFYbUeSZDlSTDocQxktrScXscpWCYUoPET8GUTVquCCRdC4EAA */
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

              onError: "ready",
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
                      description: `If an error occurs getting intro, retry up to 3 times.`,
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

                description: `Load introduction for the next tracks.`,
              },

              playback: {
                description: `Player can safely send and receive requests from the interface.`,

                on: {
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

                  insert: {
                    target: "set up inserted track",
                    actions: ["insertTrack", "insertTrackWhilePlaying"],
                  },
                },

                states: {
                  "player is playing": {
                    on: {
                      pause: {
                        target: "player is paused",
                        actions: "pausePlayer",
                      },
                    },
                  },

                  "player is paused": {
                    on: {
                      resume: {
                        target: "player is playing",
                        actions: "resumePlayer",
                      },
                    },
                  },
                },

                initial: "player is playing",
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

              "set up inserted track": {
                invoke: {
                  src: "sendIntroSignal",
                  onDone: {
                    target: "playback",
                    actions: "clearInserted",
                  },
                },
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

            description: `Previous track stopped or interrupted. Move to next track if there is one.`,
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
      clearInserted: assign({
        inserted: null,
      }),
      insertTrackWhilePlaying: assign((_, event) => ({
        inserted: event.track,
      })),
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
        const { trackList, trackIndex, inserted } = context;
        const event = announcer.state.can("append") ? "append" : "list";
        if (inserted) {
          return announcer.send({
            type: event,
            items: [
              {
                artist: inserted.artistName,
                title: inserted.Title,
                upcoming: [],
              },
            ],
          });
        }
        const track = trackList[trackIndex + 1];
        if (!track) return;
        const unannounced = trackList
          .slice(trackIndex + 1)
          .filter((track) => !announcer.contains(track.Title))
          .slice(0, 3);
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
          [],
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
