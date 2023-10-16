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
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCusCWBjAxAGwwCMAnAQ2IE8BtABgF1FQAHAe0wBcMWA7RkAD0QB2AJxCAdAA5RAZkkBGAEwiALDVGKANCAqIAtCMUrxigKyKhimTNE0aANhkBfJ9rSZcsMOSwALWgxIIKwcXLxBggiKNNHi8iryClaSkvZGWjr6qvbiIqbyMirWlqrSLm7o2Di+LMhgAXwhGJw8fJF69qY5CpKKkqYqFirDktq6CAZK4vaSqoYis-ZCMvblIO5VfqTcMAAETOSkyA1BTS3hoO1KMoriKqazIp0FpjI0MmP6VvLiQvI0kjsaSspgezlc60quG4pAAbhgoKR2PV6I02M0wm1EIp5D8RCt+mJLPYin9PhN5uIbg9lkVSnI1hssOIIKRYL5CCxyBBdvCwAB3HAsJhgbgnZjo85YiYKcQ0UoqJamOySQbkvTUkyJGjyERPPUyeTLRlQllsjlc4g8vn88QYbgY0h4XZ4LkQHAQHhgO3cWEsADW3qZZvZnO5vIwAp9judrtIEAQ9r9WCRYQC4uCksxESyBVyKj+KSE-UKRvVKn6UkU9nkSukQiEDiEJo8IYt4Zt4mI3ggFBwTDwpGoqNOWdaOYmMxkcQW+PluL+iXV1h+bweMzyBWJKhb2HEcZ5TJdGFg7H3buPp49Xp9fsD4mDB92R4Ip-P8cv7ETvpYKfO6ZHCVQnHS5sRmOUYmGaI8nuZZTHVB580kGwlgWKw+l3ZknxfE8zyfV92BwMBiGIFhiHEAckQAMzI5AH1NbCoU-d8eQI79k1THgAMCICMRAgREHyEQtQBNJRGQv4VGXOxchEeJlTEGRXgLZsIUfC8cLfeMeQOMhkFgXZ2BYXZfFwsi+wzM5s1AhAVgkYZrD1f4zCWcsbGmCwHHsGgK1SPVMJZE9KIoZ8mIIoURTFQDM2Ai4BIQfJJDuQx4nsQwhHMMlMknGg7grGQFlVQ1qXkAKICCwcQs0s8IDAZEsHYUKPEMigRRwSyxziyIbludKFASAtZlMJ5ySU4SFlsAYrBiZCyoqocmuwZjavqxqj3YVqwHa+QeJiviusQElpwrHElIUIRBhEUb3OrAoSQsLojXkUwAqPLwfF8CMoxFYgaOIZBdne4g-HEIG-F2QgQo2trPW4b0kwDINTTe7xgc+zsfr+gGwd8UHUfByGWpFdjf04qK6A62LpSMIQcjSApBh1B4aHg7K9GGXLLHiWRkIcBZwQqVsUY+r7bUx2jAfx3GYEauH+EanGia2yn9uplYcmeukXgGMR1WUCRFHQw3qwLeIBchIWmMVjHiKxyWPvEGXdjlhWpaV7bdqs-jIiNLo5WQtdF2UeRlxxOJ7CWNLzFBZUzFeq23c7crYGC+20d2btYFQPB2FgCLRRVqUJ1xd4tQbEkI96OSMnGDU1CkRUZmiJSEnMePmutyNbT8MAsH9XY-v2Q5kHa6KvYOhAjREXLSU6VQcRJK62YLUwqWsFJa1BQZhnbpbO6jHu+4Hsih70j20Sp4vy7lW7Da8ukPjZh5V-6bfDT1fExF3rA0-BzsMAgHgLaVF7QQELtZeK0Q-hSD1KYWmFZFKWHVEsXK8RHinQNAMAKTBuwHmvHDW8iN6KthwWAA8JM-xpnoOA72+hejGBUHqOw7wdaqnsMgiQDgBj3TSowuwpU1KmlZKGS01ou6OzqoZMgR9wqw3hj+e8wZhHtitKLCRjV2DSP7mxBGlCuLULHp1aU7M+i-EGMsRINwnhFHLJYcQw08jIWrC5KwZVzRhlUZ2Lw3AdKVUBgiGEeB8HyLvEjVsyiPFiKjN43xC1MBQECRQsm3EL6qwnB0VQ9jzHvDku8Ioj9a4kiShXYY+ICrT2Gi4CE3AWC1XgEEJkqSi42T0M5Y6oI7B5AbDYQ26p-iFDuPkJSFg9QNkkG4kRHYu5NIge0MQq97jKnlHA5Ylga76Aurce4xs5B2A0OMwR4T3GiLUfaGMLo3QzNoRSCwgylldNWb0tmnRjB5ENmbZYTxCgTJUVE203Z4zjF4s0+KHQ-ZrJsE4nySwCn6HuKuZY0KUhFJZj8yJainaaNIDI3CVyJ7sz9k5HUF1VRoVhRMTUTlFQPRBE8VSgs9yMWagRPF1MHDJUVGoZYNYFDsLZn8LZ+QMqFgcRYAKTKloERYp+VlE4zAMOyFylYiRayh1XlS4stYbACvFRpMKuFpXEVIsQWVNkMp4khbiE2eonm1zeFsuSKlVDqGWObdSH5qriG0qfI4BkjImTMpQU18VrC5VUH8bIKx0qKmQUYXIQrhpNlxGkOaKc-HVWDZEasq9E2qiNNEfqoxsr5pMI4Tc9x8S03xKm1OnqVq9zWkxaGYBM2IGKvY6eebLAAjQeSMwwlaYFUSDWIdcCa3pv1W+ZOqcCKi1bbZZ6VZzC8KsIYYY5JqX2JuAWb40gEgiHHQtOt80QpQGIAAudo5L42RJD8GmtM-gDFkBu1Icpt20wjvkOwoJv6-3RtMq9aSbLxFLgVOB5SSUFnVICactZp7qHeOrfIv795i1thLHG87d1xAGEOpSOshDqkfdMNKKpHXFlSChxO4jxb-T-XjEWhNm1YbUOqsDJQBXmFjUlODOp1B5GrgIhlzJhbpxtr9DDUt1HOzAPLP9SsWPyjfaGx9W4SR6xWCYC6vsdRpTkm65GCcRZJxPfJzO2dc7zvkquLpEGKxQbZm8XKpHEj6fxCSDKVHjPiMPv3QeukjhWfMNOIprwVzT0GrYiQYJkIzBmiqrzYnxEAKAVZ2Q+ZRDCprAUVUHDOHVl5gVuSShsG4MuYBkF7RkJJSBICJ6gxvLktLFSBYLMjD2tazuQ5e4IknK8aKWJIV4mBPnezAs0wjQZR1LiXoIdnkDHjTiVIPlCpxyqUAA */
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
  };
};
