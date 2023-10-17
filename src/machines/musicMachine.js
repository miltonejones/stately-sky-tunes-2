import { createMachine, assign } from "xstate";

import { getMusicList } from "../connector/getMusicList";
import { findMusic } from "../connector/findMusic";
import { getDashboard } from "../connector/getDashboard";
import { useMachine } from "@xstate/react";
import { useArtist } from "./artistMachine";
import { usePlayer } from "./playerMachine";
import { createKey } from "../util/createKey";
import { usePlaylist } from "./playlistMachine";
import { GRID_QUERY_PROPS, LIST_QUERY_PROPS } from "../constants";
import { useMediaQuery, useTheme } from "@mui/material";

const searches = ["music", "album", "artist"];

export const musicMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCusCWBjAxAGwwCMAnAQ2IE8BtABgF1FQAHAe0wBcMWA7RkAD0QA2AMwAOAHQBOAExCALAEYA7DJrqp8oQBoQFRAFpZUiSJkBWMcpHyRmsXYC+j3Wky5YYclgAWtBkggrBxcvIGCCGpqEopKYooy4mJCMvIyuvoIRlrS5oo2IiKq9srOrujYOD4syGD+fMEYnDx8EQZCQsoSyrLKNEI08jQWYuYZhglp3VJFYlrmaqNlIG6VvqTcMAAETOSkyPWBjc1hoG35UooS-SKKsbMdQmLjWTKKkp3yc+bFhTRSy1WuG4pAAbhgoKR2HV6A02E1Qq1EG8rjMnuYpMpVAoiooXkYZCYzJZrLZ7OJARUsBIIKRYD5CCxyBAtuCwAB3HAsJhgbiHZjwk5IrIJGQSBZmGjmcyicxDGTKfFCO4SToqZRCKTmYZaESU9w0ukMpnEFls9kSDDcBGkPBbPBMiA4CA8MCW7iglgAazdQMN9MZzNZGA57ptdodpAgCCtnqwUNC-n5QUFiPChikQnM0hod1+ihSyvxYil0wchR6c2M+uw-uNQfNEmIXggFBwTDwpGosKOqZa6ayfXk3REPzeGoV-SkSryEgVJe1NG+T0UNeptIDJrNIYtMHYW3YZCwXvtGFg7Gdrvdnp9Ej9G-rpuDob3B6PJ4I55jHpY8ZOSZ7AUQn7M5DFsMUxCkMQFQULM5EufEejFH4VCrHotRoPUXBWKk60DJ9G08bgWQ7LstkwKAQTwS9uDdWNvV9XCH3w7dQyIkjOwociISo784wTHgAICICERAgRDGUAtrh6eRbE1eJEnxTFs3yDoaB6RRMwuNcJEjFkgVPc9dMdQyLxdWjrwYu9cL0rYDM-dhjKjUy+N-AS+XoZNjjTUCEALEwswGWIEniO4ZXxSxpC+Io+mUIZoIcHTbPss9HNshycDAYhiBYYgJFI9gADNcuQayDWSqlTKclkHNcv9E08wCU2A05xIQIZh0uTT3nUxR-i1eR8UJYdIOldSLHkOKniEJKTJSoyoxIvZkFgA8WC2HxUtytsvL7VqIgsEQYlk+Q5SKBYtVifFbCucxblFP4lxkHSIDPUiuPmi9uV5XaWuFSaukuGYpQLDFCWnPRDAGCRZIcWCtCxJRV2w+83s4uzKocmkwGhLB9wM9gKB5HBftE-bkWg1VoLuER1DzZUdEhhBRxMKCen+JdZLMDoXrRsjPux3H8cqwniaoRRhOasnhRxGHqdHeI4sJF4KznZURAUBUZRURRzB0gzPG8HxnwtHliGK4hkHIrxiF8CRDdt43CC40WwBouif1vP0DZt3wTfyrKLath27ZDp2XaJsA6vcoS4T+gdUg1VU3hsNRdYXa6hm6N5JpmBwp0SlHcJ9o3-bNoPraNiRX1o-h9zDg9I5JprvLEg6NaEGIzsuUc5UxIbMTnRIZBHuRJvufXKobxty5KyvHernGtlr+vfeN12SYluPpYHFQZWucspUkhIEKZgwzCuAtOk1BZpW1CxJ-cee-cbV7YHe5-jebWBUDwdhYC5DyDyktW7kz8v8TugwswsxHmIZIioz5mCOkoTohR7A9QfkXA0JdHb+18GAY8WwLY7GWs3EBe1hQqCkDQGGRQsyaDeAoCGmQDCTWzIUJIoM5SpHkI-bAn88E+AISeYhuwyDIE3uQ+Ovl3gJGOuNEYcC0iDTPpYbMoxlG3CkNouwpQsG1hwS-HcloIB4DdoVK0EBSZCgTr1CQkFMwa1OiWIsZ9OhdGGE8WmchIJ3GRuUA0TBmx6XdpZL2uEglgD0tHf8jUpE718gYb41wlCWFpvIWQKD8QcPFLTZSpINQzB0vgwhm1zzbTIdvGxiTCjDgUAWfItMNR2GyWYbo8RhiZn6CkMwxShGlK2pQSRVSfJtXPoMA+sksTam0T4lRLDZJXDpgMahXVtFiGcNhbgLAIBwD4ECEZbcJhX26LqUYmhRCjnxI0mhhJxCDA1oUNQWEAm1mYluE2hywEGD6gqGGHNdb9AWLEZ4Z8+opFVBrSSk1ToFmevo9cRoWL+ytOGe0jovnCiMD0f51DAVwRBUpOK0hUhQveE0jZCK8IfMbM2KMmQRLVLGZ0SQFge62HzgqRCklTCnVgbmTMygMQvSRTS4xr5DykEIQ5TFA5WHKmOlmdQo4nhpCVKdaQogcRwLvnkEVm4GzGPYjsdGFEqKysSbC7o1hh5QQ1iWBBLDMSdVJWqfOyhKWvOpBVJ+MrezSLarIGIWpNQDCXKs1QiF+imGlLIcc4hmmzWcgLdKqULVtViDQzSMounhv+JGxBml7FajuidDJ5Yk36UxqlaqWwso5WIOmiIoguiiDgR0O6WJnkD07nYaUqc3hQTlJWjGvqa2LRIeI1a7B1plJnZQJtyIpIKGghk1ZWZwpuPePY6U8RS0OBkIXL1NI+YfWreeRdflB48M1qobpMp5mIBUGKOQdhMTUxLP8F5OEDRvw-gLXZQtR38Ndpe+CMQFROMKJpf4WgXhsu6KIS4yQLi6z0cev96MAOntMp8-1CS2qpGzDetId6O0KBeKdSBsQMlfFUCPTQvN35YfPY5TDZEoDEAwKxdkl76lzkmpqBjgx7CUZxXkPltSNK5j4VgAR5pL2ZqOn26w2i4pzEdYYEsR1-KYTmPkH4esqWGONjPQOc8w5gduJIXWZIDN9004OXWqpNT0xzkFWT8njGz0tp-e2a8tjO0bjyMDQxswzC1MUSSFh0huMPTETUuZ1JakuG8Tz09vPmd82HRe+4V4CNA-hplB0hgmEwn8SSeQ6GPteBrOccU965k1D3dLAXX44Ybt-X+-9FNWpU2+9Tk1snqFVHi3xdgnFCta6XRsJSRG5UnfsXrPKMR9WggoO6usxhnwBuKBwyRU7QScdN3BjZuNmMU-na4hZHgzFSaClh7jrg+O8U8Lq8Lj2RL0pen5dxJBTXEBiXUVzEGjnsYMDJmFEh-aM8eubG1BkMqlsVww0ouiaTzjqIVmtslyPSVoUYo4PXKk2Y4IAA */
    id: "music",

    initial: "preload",

    context: {
      queryProps: { field: "ID", direction: "DESC", page: 1, type: "music" },
      searchResults: {},
      musicList: {},
      memory: [],
      memory_index: 0,
      trackList: [],
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

          ready: {
            on: {
              play: {
                target: "get track list",
                actions: "assignQueryProp",
              },
            },
          },

          "get track list": {
            invoke: {
              src: "loadTrackList",
              onDone: {
                target: "send play signal",
                actions: "assignTrackList",
              },
            },
          },

          "send play signal": {
            invoke: {
              src: "sendPlaySignal",
              onDone: "ready",
            },
          },
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
              src: "loadTrackList",

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
            target: "check history",
            actions: "assignPreload",
          },
        },
      },

      "check history": {
        always: [
          {
            target: "load music list",
            cond: "query was saved",
            actions: "assignCachedProp",
          },
          "dashboard view",
        ],
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

      home: {
        target: ".dashboard view",
        actions: "removeCachedProp",
      },

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
      "query was saved": () => !!localStorage.getItem("queryProp"),
      "type is list": (context) =>
        context.queryProps.type === "music" || !!context.selectedID,
      "more search types": (context) => context.search_index < searches.length,
      "has search param": (context) => !!context.searchParam,
    },
    actions: {
      navigateMemory: assign((context, event) => {
        const memory_index = context.memory_index + event.offset;
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
      assignTrackList: assign((_, event) => {
        return {
          trackList: event.data,
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
      assignQueryProp: assign((_, event) => {
        const queryProp = {
          queryProps: event.queryProps,
          selectedID: event.selectedID,
        };
        console.log({ saving: queryProp });
        localStorage.setItem("queryProp", JSON.stringify(queryProp));
        return queryProp;
      }),
      assignCachedProp: assign((_, event) => {
        const queryProp = JSON.parse(localStorage.getItem("queryProp"));
        console.log({ saved: queryProp });
        return { ...queryProp };
      }),
      removeCachedProp: assign((_, event) => {
        localStorage.removeItem("queryProp");
        return { queryProp: {} };
      }),
      assignParam: assign((_, event) => ({
        [event.name]: event.value,
      })),
      resetQueryIndex: assign({ query_index: 0 }),
    },
  }
);

export const useMusic = () => {
  const listman = usePlaylist();
  const artisan = useArtist((art) =>
    send({
      type: "change param",
      name: "displayArtist",
      value: art,
    })
  );
  const player = usePlayer(artisan);
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
      sendPlaySignal: async (context) => {
        const { records } = context.trackList.related || context.trackList;
        player.play(records[0], records);
      },
      preloadPlaylists: async (context) => {
        return getMusicList({
          type: "playlist",
          page: 1,
          field: "Title",
          direction: "DESC",
        });
      },
      loadTrackList: async (context) => {
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
    if (rec.Title && !rec.FileKey) {
      rec.listKey = createKey(rec.Title);
    }
    return rec;
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const rotated = useMediaQuery(
    "@media screen and (max-width: 912px) and (orientation: landscape)"
  );

  const sendToList = (message, type, id) => {
    send({
      type: message,
      queryProps: {
        ...LIST_QUERY_PROPS[type],
        page: 1,
        type,
      },
      selectedID: id,
    });
  };

  const openGrid = (type) =>
    send({
      type: "open",
      queryProps: {
        ...GRID_QUERY_PROPS[type],
        type,
        page: 1,
      },
    });

  const sortList = (field) =>
    send({
      type: "open",
      queryProps: {
        ...state.context.queryProps,
        field,
        direction: state.context.direction === "ASC" ? "DESC" : "ASC",
        page: 1,
      },
      selectedID: state.context.selectedID,
    });

  const openList = (type, id) => sendToList("open", type, id);
  const playList = (type, id) => sendToList("play", type, id);

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
    openGrid,
    playList,
    refreshList,
    isMobile,
    rotated,
    sortList,
  };
};
