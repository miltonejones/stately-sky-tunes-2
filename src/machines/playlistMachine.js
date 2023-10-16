import { assign, createMachine } from "xstate";
import { getMusicList } from "../connector/getMusicList";
import { useMachine } from "@xstate/react";
import { savePlaylist } from "../connector/savePlaylist";
import { createKey } from "../util/createKey";
const playlistMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnqglrALgHQ4SpgAEB6+YAxBAPYB2YxTAbgwNatpa4FipClRoIcHBgGNqOZgG0ADAF0lyxCgawc+OUw0gAHogC0ARgDsANgA0ITIgAcVworeKzAJkefPVx4oArJ4AviF2fNh4RABOYOgQmLQMyGBMagbIWjp6BsYI5gAsFoTOFmYAnJaBhQDMlrW1dg4ItcWEZrUWjmZWVoWeXoUVYREYUYKRAvjkeOQpaZC0UqhaYBlIIFnausx5iJ61joT1noHNpo2EFsMVjuUWFvUVgaNb49OEU9GzsPOpLAgQjItASEA2mh2uU2+U6hUId0CVUszjcVhuFwQVjaCIqVkGAzMik8dysb2+kw+PzmC0BwLoUji1HWKky2V2+hhpm8xzMgXuNUsigCtnsiCJZjMhHRjluTxuhWJ5KplP41L+tMghDiADM4rAABbkab0ZisCScHhfFVECkzGkArW6-VG6biSQyDlqCFbdnQ0D5czE6WdG6oipPTpNMUICW1DrdYokwKKQqOO7KtWqib2jWOoFg8j4GLoKRcIsMch200sNiW3g261Z3P-RYFiAQIslssVqs292cT16b2szbbHJ7LkIRWeVwWDwotq1YIYmOyxQdCq1PzprdtPqZnNNnO-Vt0xnxGjkFgAd2N0Rr5skVrtx+mp81QIvzOvYDvbotaRZAUFQfXHDl9laCp4S6NNFDuDw6g8UUWk6RR40CXpCmKVMXgsEZwneZttXiRJQQgA1pDAv1JwDUx+gqE550aecbkCfozExTxFBKTwnmKYZAhuElGkPT4EnISipHvAhHzrbgG2IiSpJk-AByAr1QNHSEJ05OiCmwqVt0GRxgjMWVnBQy5Z08W5ZX8cykNqMJCKYBgIDgTIbTZKFaKMUwLD8VwgkKdijls9FoxaIp4RuCp4raWVFXuRwxOielKHwZkfN0yDzHTQgU26LxzhjEx2luO4HkjaDUsI18mUSHKIKncxahcIqejOLjag3dwPG8Xx-CCNLs3fB022a-1-IKLpGKsGo+isdDTPKTxMUW65fEjUzCksXpRttG0P3zekpr8wNGilBbCiWlahK8TFsUCQgk2sM5sPxfxDrfdUzydMA9TgV1onOvSZuXeFkoqWzJUUKwYfhzEJQ3Cognh+HuLMswfrtE620IQti1Lct8ErO0wcgrpjkebcU0CdiiVXFpsXhXw+L27wiTcAixmIvGJvPJkr1vVTKda3rrv5CwkTcFMeK6ZHbMYvjJQFJ4-C3H7lOkMWxxo8HAxlYKajCnxbqeTETCEwhlbuRUhKErcahckIgA */
    id: "playlist",
    initial: "idle state",
    context: { songs: [], playlists: [] },
    states: {
      "idle state": {
        invoke: {
          src: "preloadPlaylists",
          onDone: {
            target: "ready",
            actions: "assignPlaylists",
          },
        },
      },

      ready: {
        on: {
          open: {
            target: "playlist is opened",
            actions: "assignTrack",
          },

          adhoc: {
            target: "ad hoc list",
            actions: "assignAdHoc",
          },
        },
      },

      "playlist is opened": {
        on: {
          close: "idle state",
        },

        states: {
          idle: {
            on: {
              add: {
                target: "add track to playlist",
                actions: "assignListname",
              },

              create: {
                target: "create new list",
                actions: "assignListname",
              },
            },

            description: `Playlist is open and user hasn't clicked on anything yet.`,
          },

          "refresh list": {
            invoke: {
              src: "preloadPlaylists",
              onDone: {
                // target: "playlist is opened",
                actions: "assignPlaylists",

                target: "idle",
              },
            },
          },

          "add track to playlist": {
            invoke: {
              src: "editList",
              onDone: "refresh list",
            },
          },

          "create new list": {
            invoke: {
              src: "createList",
              onDone: "refresh list",
            },
          },
        },

        initial: "idle",
      },

      "ad hoc list": {
        invoke: {
          src: "createList",
          onDone: "idle state",
        },
      },
    },
  },
  {
    services: {
      preloadPlaylists: async (context) => {
        return getMusicList({
          type: "playlist",
          page: 1,
          field: "Title",
          direction: "DESC",
        });
      },
      createList: async (context) => {
        const { track, listname } = context;
        const playlist = {
          Title: listname,
          listKey: createKey(listname),
          related: [track.FileKey],
        };
        return await savePlaylist(playlist);
      },

      editList: async (context) => {
        const { track, listname, playlists } = context;
        const playlist = playlists.records.find(
          (f) => createKey(f.Title) === listname
        );
        if (playlist) {
          const { related } = playlist;
          const updated = {
            ...playlist,
            related:
              related.indexOf(track.FileKey) > -1
                ? related.filter((f) => f !== track.FileKey)
                : related.concat(track.FileKey),
          };
          return await savePlaylist(updated);
        }
        alert("Could not  find playlist " + listname);
      },
    },

    actions: {
      assignTrack: assign((_, event) => ({
        track: event.track,
      })),
      assignAdHoc: assign((_, event) => ({
        track: event.track,
        listname: event.listname,
      })),
      assignListname: assign((_, event) => ({
        listname: event.listname,
      })),
      assignPlaylists: assign((_, event) => {
        const playlists = event.data;
        if (!playlists) return;
        const { records } = playlists;
        const songs = records.reduce((out, res) => {
          return out.concat(res.related);
        }, []);
        console.log({ playlists });
        return {
          playlists,
          songs,
        };
      }),
    },
  }
);

export const usePlaylist = () => {
  const [state, send] = useMachine(playlistMachine);

  return {
    state,
    send,
    states: playlistMachine.states,
    add: (listname) => {
      send({
        type: "add",
        listname,
      });
    },
    create: (listname) => {
      send({
        type: "create",
        listname,
      });
    },
    contains: (track) =>
      state.context.songs.some((song) => song === track.FileKey),
  };
};
