import { createMachine, assign } from "xstate";

import { getMusicList } from "../connector/getMusicList";
import { findMusic } from "../connector/findMusic";
import { getDashboard } from "../connector/getDashboard";
import { useMachine } from "@xstate/react";
import { useArtist } from "./artistMachine";
import { usePlayer } from "./playerMachine";
import { createKey } from "../util/createKey";
import { usePlaylist } from "./playlistMachine";
import { LIST_QUERY_PROPS } from "../constants";
import { useMediaQuery, useTheme } from "@mui/material";

const searches = ["music", "album", "artist"];

export const musicMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCusCWBjAxAGwwCMAnAQ2IE8BtABgF1FQAHAe0wBcMWA7RkAD0QBGAEwiAdADYAnEIDM0kQFYhS5SIDsIgDQgKiALSyAHOKGTlQgCzLJxoRukBfJ7rSZcsMOSwALWgxIIKwcXLxBgghCDqbSVnIaMXIy0jRCuvoIRkKm5so0Wo5yxhrGLm7o2Di+LMhgAXwhGJw8fJEGkkqS4vbGIsZKNhpWI8YZhrISdnGK0sbSkhrJ5SDuVX6k3DAABEzkpMgNQU0t4aDtQjQF4iI0qSMy1mljeoZicuJK0skDIlbypREKzWuG4pAAbhgoKR2PV6I02M0wm1DOYaOI4iJRMVUiVFpJxlkTFISgU-lcuvJgZUsOIIKRYL5CCxyBBtpCwAB3HAsJhgbhHZiI04orJWGgfBxWea3aSJGhKDSEgxyByfQZqEZaSRWBZyakeOkMpks4hsjmc8QYbhI0h4bZ4FkQHAQHhgK3ccEsADW7pBRsZzNZ7IwXI9tvtjtIEAQ1q9WBhYQCguCwuREUMMgkGiUirinQSNB0rzFjnES2MclVCtuCVzBuw4ijbJBDowsHYTadbY7LrdHq9vvE-ub21bBA7XejPfYsc9LATp2T8OOadaGay0Qkf2kuPMWnFxgJJYMSli0oSizmIjk-QbtNH4-bndHE-YODAxGILGI4iYeBhAAzH9kGHGkpxbGkZwgmc53jRMeGXQIhVCddzmEERpB6CUbwVS5JCzZU5CuDFZCsJQ7iWJQ5BUe8YKfSdozZPYyGQWBtnYFhtl8Z8fwoHAUxOdN0KyLEMR1G9VQGeQVHiZV4g0KRNBoAiaGlUkbzoiB23-UgKDHKC3x5PkBRXFCkTQgRhAIjFNBERYFAo6UtGVSR0VGYoNBzRwVEkZZXFWcDtNgXT9IYzsIDAWEsHYAyPA4ig+QEszU1Qs4rM3CVPm+Tp-kUf4-jkQkaKwuYNDsNRFHsYYlC0nSALCwznzpKKwBiuLsASpKqCEZDUos9LIixboFhUxYrC80QVKsYqEhuSRohGaxBmmujWy8HxfBDMM+WIYDiGQbYNuIPxxGOvxtkIfT2ESsA+24d04x9P1wPW7wTq2i0-0-fbDvO3wzvei6rq6sA4IXBDTLoQS10G4Q+lMKsdUqtyShyeS5CsHovhvRRqLuUQ1qg-7tstXbfqOoGAZgWKHv4WKSZu7qUqEyzIgcNUj2kCjcIVPylRPTChHEZI7j6eQJpozoifikmvvJkDKc28Qae2OmGap0GBN6hE0tFaJrkcYx-gIroaPKojVBFtTKscxVzBlzq5dDS1gtCpWPu2Yg4FQPB2FgYz+RhvWNzPWIBmm6jSgsGaT1vJQbhyK4rDsUQ5iER2sA9i6vr8NrvW2fbdn2ZBkr61m4aiawJFUTQNAlAjEkVeSZHECbzH+NRBnI8q6KYb3m3ux75yHf1+7AZtwcXJN6GDgbRQ6OIRcuSX-ilNRlTPDEL3U4xpL+TPs8+l3xDzrAC6LliDm18vYf10RFOGbFiOiCjj0yU8y13W4JRU3cFozgFf0b1NqkytBAPAd1ALWggHPEUG5q4fAWinEo8RpRqWLB-AiWN+iLDUFcXcXQygrG4CwSK8Agggl1vPDcBg+gfGomeWQfM3KqmVJcFSZhSSKjuOKBIzggFBWNEGM0pNqHwJEgYLyCdGHzEuF0Vh6QTz126JeIsZ5lDty0sI005oT7WgjA6J04jhIZSkZoT4NE5EsIlEorBOQejlQlDjGiOJtGBl0WA720ZMjmQkWY1SItyrWE6CpCiakiJFjbmRLycQChLEkHRR8TUOwmLZqiPoGI06yFzLXBUShlSJAkORKU8wZBqSPEk7s4UYJvjSZXAwEssmYRySofBuYiLKFItYUo5gEhN1qoIw0yT4pvhgp+b8xB6mimSBIfGMQ5RaFSJgwwxFikxMcOKLy-kKjDOqSkzsTFi6sXYpxbivFKDTNoVvFOalLwUS8ig1yfwMQqBzKkRY0RFh1RCg1DqWc6mrhDpItEGJiIWAIkIGYVjCQOG3H5VGBQFSpDmD892NTIrRViq2JmYArkgtEGClS9kFrQubiWZQWFyrJDmBeeuuo0V-IxfVPSM4xFApoQS9EMhSVyL8sbIshIU5zNvOoHIAxqyJKGY2N2TKDl0hZfpKAxAMB6K5PijKWIsbakwnvaw0oU5CqPOIHCthqLqTlIfZ26qOX+MiDmBOBsI6yF3PId+hhHCKXBYCOYcwZCDN2Y2EBnt5Y-UVv9DV7MCJYS5jzYifMEiFLuNhRY5U+iODSFKwNtJg05xPgrA6R9AagJBriyNwhvJSEGHYBQfScixywWIa2qaxpfCrAGwKhpc3Hx2mGwt-0VZRTVmAemR9QblqiE48sBqk4LBGLeZUuE27RG+OpeuohpbSpzcTTWX1ZWspJt7WAvt-YTuMFlJ1FEXWyGSIupe6aZgEOKAtK1u6T5nwvj+Y5Bwz05hFgikY9k16GpPO3csWIviN36AoEYfcB7GNtaY9oiQPiXlUPEVUtaBaZExsLBQ57NRrLmGpV9oCvqqsgROxaCcCLESPCo24KhXKJDMMjVI8h5i3g0C4FwQA */
    id: "music",

    initial: "preload",

    context: {
      queryProps: { field: "ID", direction: "DESC", page: 1, type: "music" },
      searchResults: {},
      musicList: {},
      memory: [],
      memory_index: 0,
    },

    states: {
      "dashboard view": {
        states: {
          "initial load": {
            invoke: {
              src: "loadDashboard",
              onDone: {
                target: "ready",
                actions: ["assignDashboard", "resetQueryIndex"],
              },
            },
          },

          ready: {},
        },

        initial: "initial load",

        on: {
          open: {
            target: "load music list",
            actions: "assignQueryProp",
          },
        },
      },

      "load music list": {
        states: {
          "load list": {
            invoke: {
              src: "loadListList",

              onDone: {
                target: "#music.display music list",
                actions: ["assignMusicList"],
              },

              onError: "load error",
            },
          },

          "load error": {},

          "add params to history": {
            entry: "assignMemory",

            always: "load list",
          },
        },

        initial: "add params to history",
      },

      "display music list": {
        states: {
          "detect music type": {
            always: [
              {
                target: "display list view",
                cond: "type is list",
              },
              {
                target: "display grid view",
                actions: "assignMusicGrid",
              },
            ],
          },

          "display list view": {
            invoke: {
              src: "sendArtistSignal",
            },
          },
          "display grid view": {},
        },

        initial: "detect music type",

        on: {
          open: {
            target: "load music list",
            actions: "assignQueryProp",
          },
        },
      },

      "music search view": {
        states: {
          "perform search": {
            states: {
              "search by type": {
                invoke: {
                  src: "searchMusic",
                  onDone: {
                    target: "get next search type",
                    actions: "iterateSearchParam",
                  },
                },
              },

              "get next search type": {
                always: [
                  {
                    target: "search by type",
                    cond: "more search types",
                  },
                  {
                    target: "#music.music search view.display search results",
                    actions: "resetSearchIndex",
                  },
                ],
              },
            },

            initial: "search by type",
          },

          "display search results": {
            on: {
              open: {
                target: "#music.load music list",
                actions: "assignQueryProp",
              },
            },
          },

          "check for param": {
            always: [
              {
                target: "perform search",
                cond: "has search param",
              },
              "idle",
            ],
          },

          idle: {
            on: {
              find: "perform search",
            },
          },
        },

        initial: "check for param",
      },

      preload: {
        invoke: {
          src: "preloadPlaylists",
          onDone: {
            target: "dashboard view",
            actions: "assignPreload",
          },
        },
      },
    },

    on: {
      library: {
        target: ".load music list",
        actions: assign({
          queryProps: {
            field: "ID",
            direction: "DESC",
            page: 1,
            type: "music",
          },
          selectedID: null,
        }),
      },

      search: {
        target: ".music search view",
        actions: "assignSearchParam",
      },

      home: ".dashboard view",

      "change param": {
        actions: "assignParam",
      },

      navigate: {
        target: ".load music list.load list",
        actions: "navigateMemory",
      },
    },
  },
  {
    guards: {
      "type is list": (context) =>
        context.queryProps.type === "music" || !!context.selectedID,
      "more search types": (context) => context.search_index < searches.length,
      "has search param": (context) => !!context.searchParam,
      "more questions": (context) =>
        context.query_index < Object.keys(context.queryProps).length,
    },
    actions: {
      navigateMemory: assign((context, event) => {
        const memory_index = context.memory_index + event.offset;
        // alert(event.offset);
        const memory = context.memory[memory_index];
        if (!memory) return;

        return {
          memory_index,
          queryProps: memory.props,
          selectedID: memory.id,
        };
      }),
      assignMemory: assign((context) => {
        const memory = context.memory.concat({
          props: context.queryProps,
          id: context.selectedID,
        });
        return {
          memory_index: context.memory.length,
          memory,
        };
      }),
      assignMusicList: assign((_, event) => {
        const musicList = event.data;
        return {
          musicList,
          searchParam: null,
          detail: !musicList.row ? null : musicList.row[0],
        };
      }),
      assignDashboard: assign((_, event) => ({
        dashboard: event.data,
      })),
      assignMusicGrid: assign((context) => ({
        musicGrid: context.musicList,
        musicProps: context.queryProps,
      })),
      assignPreload: assign((context, event) => ({
        musicGrid: event.data,
        musicProps: {
          type: "playlist",
          page: 1,
          field: "Title",
          direction: "DESC",
        },
      })),
      iterateSearchParam: assign((context, event) => ({
        searchResults: {
          ...context.searchResults,
          [searches[context.search_index]]: event.data,
        },
        search_index: context.search_index + 1,
      })),
      resetSearchIndex: assign({ search_index: 0 }),
      assignSearchParam: assign((_, event) => ({
        search_index: 0,
        searchResults: {},
        searchParam: event.searchParam,
      })),
      assignQueryProp: assign((_, event) => ({
        queryProps: event.queryProps,
        selectedID: event.selectedID,
      })),
      assignParam: assign((_, event) => ({
        [event.name]: event.value,
      })),
      resetQueryIndex: assign({ query_index: 0 }),
    },
  }
);

export const useMusic = () => {
  const listman = usePlaylist();
  const player = usePlayer();
  const artisan = useArtist((art) =>
    send({
      type: "change param",
      name: "displayArtist",
      value: art,
    })
  );
  const [state, send] = useMachine(musicMachine, {
    services: {
      sendArtistSignal: async (context) => {
        const { records } = context.musicList.related || context.musicList;

        const record = records?.find((rec) => !!rec.artistFk);
        artisan.send({
          type: "open",
          ID: record?.artistFk,
        });
      },
      preloadPlaylists: async (context) => {
        return getMusicList({
          type: "playlist",
          page: 1,
          field: "Title",
          direction: "DESC",
        });
      },
      loadListList: async (context) => {
        const res = getMusicList(context.queryProps, context.selectedID);
        if (res.message) {
          throw new Error(res.message);
        }
        return res;
      },
      searchMusic: async (context) => {
        return findMusic({
          page: 1,
          param: context.searchParam,
          type: searches[context.search_index],
        });
      },
      loadDashboard: async (context) => {
        return getDashboard();
      },
      // sendPlaySignal: async (context) => {
      //   return console.log("playing");
      // },
    },
  });
  const events = {
    home: "dashboard view",
    library: "display music list",
    search: "music search view",
  };
  const setState = (name, value) => {
    send({
      type: "change param",
      name: name,
      value: value,
    });
  };
  const { records, count } =
    state.context.musicList.related || state.context.musicList;

  const corrected = records?.map((rec) => {
    if (rec.Title && !rec.listKey && !rec.FileKey) {
      rec.listKey = createKey(rec.Title);
    }
    return rec;
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const rotated = useMediaQuery(
    "@media screen and (max-width: 912px) and (orientation: landscape)"
  );

  const openList = (type, id) => {
    send({
      type: "open",
      queryProps: {
        ...LIST_QUERY_PROPS[type],
        page: 1,
        type,
      },
      selectedID: id,
    });
  };

  const refreshList = () => {
    send({
      type: "open",
      queryProps: state.context.queryProps,
      selectedID: state.context.selectedID,
    });
  };

  return {
    state,
    states: musicMachine.states,
    send,
    ...state.context,
    setState,
    records: corrected,
    count,
    events,
    player,
    artisan,
    listman,
    openList,
    refreshList,
    isMobile,
    rotated,
  };
};
