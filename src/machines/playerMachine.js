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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYjSwG0AGAXURQHtYBLAF1qoDtKQAPRARgBY+A6AGw9BATi5dRAdglcSAVgA0ITIgC0EwQGZ+ongA5RJAEzH5RroIC+V5YWw5+qKuggACALboAxgAtazGD8sPToOPRu9rhuASHozN5geBAsQQEAblQA1kFRjs6unj7+gcGh4ZEYDjHMcQlgCBlU3uiMLKRkHWzINAxMrEgciMY8ovxaWlIiplNm+iLKqghqxiQkUvzyWgokovIGPApSNnZVuE4u7l5+AUEF7mAAjgCu6Ki0AF64yan8TTn8PIXQrXEp3S5uJ6vd5fHCNZiZFptZgdLqDHp0ZFsTgIAQ8eRcKTGMQGbZcYz6JQqdRcczGTZSKSibZ8BSEk4gIH2AJQPAhKjINHUTH9bHqLRcXRyUQWcTSQ76QSLGlyQSbQRErTEwnaHhaDlcqo8vlgMBZIWc3pYwY40wU-i0uRrHbGIlK6kIST6fhSBTCQTyQQmQTGLT6A1nRzc5i8gDCAHl4wAlAAiAGULRi+iwxQhTIGpWt5FtDFJ9CR3Us1DxaUJGTwyxJjKIzPrbJzI4CjTG+bRUGB6pmraKbcMRvIhOItHwtMJKcrlsY5Lp9FwteT5L7ptZ24asMbYrh6EORTnR3nVhPJOTy-pVwTRJX1CN+KYA2JNw35CZaRGsOdo15ZxnggXAT2zAZQFtCUJ1Gcx9FWEQ+CmBceFDfh8V2ckJmJcweD-Bwu33GMyjCCJAP4GAIniZgqGeeoPGYegflKf5ck7Ci4gqCiqLcGi6IYpj4URVp+lRchumHM8oPUAkJxISlHzWNDyUELgFzUIldBdRsjCmcNdw47soFI7jjMosBqOYWj6MSRjmJSViEWydj-yjcyuPI8zeP42ywHs4TmlE9pyCILgKHRKTIKGBASAXEgCIAjzyi84iTM8viQKYFi0mcgE90wHlTNSwqSIy9AsqoQKkTE0KJMi09opxeRXSEMxH0MLUJUfBdmx0QQNQJWlyz0cs21ONyiNK9KUsqNLisyiBstwHAqHc1oADM1o8KakvmjLONmiqlqqpoapCzp6uFCDcy4QxxjpNC9nkfQJWMBcCRIFctGkBCTGkEg9US9bpoWzjkDAdAshqehVpyv48tcwjDrIubQdgCGoZh1bquClE6oi67rRk5ZyUlEheBISZNw1GQG16xVdDU-QZBGORkOBqaioO8yNoCB52FoEIeT46yBLspj4bY3aQe52aKL55gBaFxgY1FmzBPoXHkXEwnLUa3MNCdDCNUOR18V4d6PVdb0iRlLVmyOcwdwm5HktRhX+chQXhbV3zNalxGZa5sr5d5r2wB91WoHV8X-KEs68dRcLJIN88NEBngfWEIkpA-R8tCpJZeAnVdy0DPOZVXIlOYowCakiVaoBwOBYDwAAFJN4wAcSTABRNMMyu-WbvPckXyXaQBpERUq4XYR6W66cEJ+sMRlr8z64CRuqGb1u8HoXeoH7cDiZiwlCQdcwJTzn7aWEeea34BR1xZswKckDf5q35gd732BYDBEsm4Z4yA3CBHYBEWGPgsiB0yPlIy39jIN2QE3FuACgERFAeAyOUCcAwO1rVS6essxnxxBIGQr4pDbG6q2DUqEzCbAlIYU29Ya6GUmnXZB29UG73QYA+wAAjGBBAKqwDAKfEcJN5hjEBjMMuexCRaHnuhQwEgjAsNpGYL+oMf5-34VNYR3hYF9wAHIpkkdJGKzIvoKEOPsMQhI9hPmWGGHQ1DHwUi1EGF6+EOFuyQWlFBaDW6GJEWYixKcGqjxJnIFm-AWbiDXEufEed9AaUtjoLYdN8xmBrAZV2e1dHcN-rw-+AiqhGNgZ3PuAA1AAkvGAAqkPEhUVcxjU2EkmcchvwTAyUGV8d4pgKWmI+UQOiip6LKQYvwYBjFuC2jgPi4QVZ4EsU1bgBINi+ntqzUQlJLALiUc-R2voJRrwDH4wpssSLTJCRguZCylkrMYCEdZUSiZSPPvsMYYYBrXyDGGZkDMdkSEVB+NSS55CTLuSU-RoTxFK1eSrNwdAoDMDeHAlywcuFBJ4Q8wBSL3BkVReizFqBCEXQ2bdVc9JFEtS2MICUFZUKX22NQhsep8QjGOP4opUzuGwEiGIyAeB0HPA8BI4epDvk4k8T6dYchJhOIrDwBcUwNjmCJK6cQSEDCwpMtAhZA5QIQDwOwOI9AgjoA2tanAAAKb8JAACUBBEGg2NdDU1kAaXpzMIvZk35NwsubOqj0ag16vh+toQMYgKQyENfwL1kIlZistaEa1-BbX2qdWsN1BUiopp9RAMKbS04kxWGsH0obAZlkEJSdJEbxATnlMq5CfBRic3uEUG4pQnnQzyG4TIqBJVJD9ZW3gWdJB230neTQUgNJLnWM-WdRIXT7BsO2WioF4DokjKnGJMUNAaIwnnZCqwG2MiLs+OCQg7oVkpHTIMBSOyTR7aCW4h6yHPjLFQkQuxhkUkMEuhUDoH13mcTImF-L8gQk-aUHmbkah1ESN+uVz5tj-qDAct+d55wRskDKKUroNxSDjdct9hEP3FFuPwFurglhfKsTiDQDYEnlkOA2vgdKm1VkppKHjr1ZxBiVZRoENG+3gkKFCN4nxcDoZY4gShFNFF6A3Nq0QGTywbEvPsblgYNyGsU5s0miovoNmEA2S9LNyMaTkjWx8hJmyrEMOJj1csPbGRM4bO65Iz1WfXVeuzEbELaT6RbBsFMyxJqQ6DHyYs-L2R8+nJ0WcRPbFMAoGR6kI0Nt0H0vQfAQyEhgzckOM0vP7SOpVFLsTLAPUpue-EzsXGhnpLPYTM8vEUli2HfamNoYBFhlQOrx7SSbBEBYZhepQzKOtiIV84KpiWGmLwF2VGBWhyq6DRWytfYx39hLegY3WM6izpZi9j7r29T1A6U28o7w-TDUm+5fDW6neU3oU5aTQzaskFbYuX0pgtmm5YYsudXvwpmYi4B2CIF4JgZ9z035JQyH2C1ZkGpgMLjDFnRslIRiF1nAoKH+LSmErCcY5H8x6QmF+4XaQAPcfMk2CGtxCEmQKTJ9NYJ73Hm+HmdDF5pKQjI80DoOYWpnZNhGMcgwmwznaGJD9XYG3C1wvJwijBxKUUhDRbQDFbxxf1odIDFqJPyzknDcXNCPpRjNgba6CkroeciyFiK544iIA09Z+IcjFIxABnI1pj0LY1SSBDA2lVq4u2wYq8m-BJq00++iT+hA75n73hasqg5tINKFzR3NqL17GQTCTStNaaKUoi2OkwE3ralymxrO+P088mSK4OQpNcMgKx8vK5JsE-AB1o2iCOsdyOq1fQbZYBC1cXphiXa6CPEH5i+i2K7rdQA */
    id: "player",
    context: {
      trackList: [],
      trackIndex: 0,
      silent: true,
      shuffle: false,
      repeat: true,
      volume: 1,
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
            entry: "initVolume",

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
                },

                description: `Generate a fresh intro from ChatGPT`,
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
            },

            // on: {
            //   silence: {
            //     actions: "assignQuiet",
            //   },
            // },
            initial: "find existing announcemnt",

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
      play: {
        target: ".playing",
        actions: ["assignTrack"],
        description: `User clicks play on a track in the UI.`,
      },
    },
  },
  {
    actions: {
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
