import { assign, createMachine } from "xstate";
import { getMusicList } from "../connector/getMusicList";
import { useMachine } from "@xstate/react";
import { savePlaylist } from "../connector/savePlaylist";
import { createKey } from "../util/createKey";
const playlistMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnqglrALgHQ4SpgAEB6+YAxBAPYB2YxTAbgwNatpa4FipClRoIcHBgGNqOZgG0ADAF0lyxCgawc+OUw0gAHogC0ARgDsANgA0ITIgAcVworeKzAJkefPVx4oArJ4AviF2fNh4RABOYOgQmLQMyGBMagbIWjp6BsYI5gAsFoTOFmYAnJaBhQDMlrW1dg4ItcWEZrUWjmZWVoWeXoUVYREYUYKRAvjkeOQpaZC0UqhaYBlIIFnausx5iJ61joT1noHNpo2EFsMVjuUWFvUVgaNb49OEU9GzsPOpLAgQjItASEA2mh2uU2+U6hUId0CVUszjcVhuFwQVjaCIqVkGAzMik8dysb2+kw+PzmC0BhDiADM4rAABbkab0ZisCScHhfKmU-jUv60yD0sBMuBs6biSQyXbpFQQrbZBX7ApEzyEKydG6oipPTpNeyIImdDrdYokwKKQqOO7kgVECkzGkAsVg8j4GLoKRcL0McguzksNi83hO-lCgi-f6LIGe72+-34QMu2WceV6NTK7Y5PYwxCFYmuCweFFtWrBDEmhCOYsdCq1Pz2pttPqO6POp2x0VAkggqRxajrFSZVXQ0D5EzeY5mQL3GqWRQBWy1s1mbWWioGrqFYuhcLvLtRiaukXuoFD+I0cgsADu7OiIe5kj5LtP017l8I15Hd7AR8ZR5aRZAUJUx02PM1ULVoKnhPcAjuDw6g8NcWk6RRakIQJen3MthkCCwRjeJgGAgOBMidccoQLKdTAGEorBqPorCwxwiK8TFzCrVx3DMAZnCIxxHE7M9gREfARxo-N9Fg8x7RwxRui8c5axMdpbjuB5DXg0Sjw-YdEhkmD6I1WoXBtFSzkxQ5FD4twvB8FsgjEz4XW-eMTMnIxLmI7UWL6djOM8TEWOuXwnhXYsrERNzok-YU4zpAcwG8ujfIKRpN2YwpWOC8pQtrbFAkIK1rDOfd8X8eLBTPTy6UZZlpWidK5LMqt4WLe1PEKMwiVizxFHQ00PHsiogmG4ahuCfrau7LsGo9CAIC9H0-QDINqKgicMvyLpjkeZsbUCQIdWUwpMWxeFfE8G4nKJNwSLGE8PLdeNf2HW8HyfAg2vVExag8ALFwmyblK6TEhgqQg7v6xcnj8JswjCIA */
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
