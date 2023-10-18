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
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCusCWBjAxAGwwCMAnAQ2IE8BtABgF1FQAHAe0wBcMWA7RkAD0QA2AJwAOAHRiRARgBMcoWNEAWAOxC5AGhAVEAWhk0RaiSuMqArAGZrxodZliAvs51pMuWGHJYAFrQMSCCsHFy8wYIIMuKSNDRiKiqOlkJCMiraugZGJmYWNnYiDk6u7ujYOH4syGCBfKEYnDx8Ufpi1iISMkoynWoqItZiMjI6egiG1mpyEpZq8ZYZtiI2ZSAelf6k3DAABEzkpMj1wY3NEaBtGTKmlipiNEqi9zTJ4wZyPRI0itaWvxMQnmcnWm1w3FIADcMFBSOw6vQGmwmuFWohbkIpGlVop0rZbmoPpNcqZzCIrLZ7I4XG4NhUsBIIKRYH5CCxyBA9jCwAB3HAsJhgbinZgoi7oknJCRqUa3UbWOQaWRiYn6ITS2xyVLTaT3JRghlMllsjnELk83kSDDcVGkPB7PAciA4CA8MDW7hQlgAaw94ONrPZnO5GD5nrtDqdpAgCBt3qw8PCgVFIXFaMiOWM1h+cj11mBMULarEXwkSiGT2GYhsllBdIDzKDZotYatxB8EAoOCYeFI1CRZ3TLUzkw6Mmx-1+DzsKiEarSph6Il+igG6RolkNnkDppDlokMHYe3YZCwPsdGFg7Fd7s93r9EkbJuD5tD4aPJ7PF4I17jXpYRMLhTQcxTCEcrgMVIaFzIRN1lGs4JGEsEjMTQ1HmVIRGwxRt2wXdX1bcNvG4Lle37PZMCgSE8FvbgPXjX1-SNJs9zfA8SLIvsKEo2EaP-BMkx4ECgjA1EIIEAxEhzOQaBmOQkicOcYjVbCJ1+DDHgBYpUnrcod2jLlwUva8JEMkybzdej7yYp8jXM4zf3YMznQsgTAKEkV6FTc4M0g6JRHLaCbjzOVUjVSxJApDo1AWAYEjzaw8MZByGQslyYwsnAwGIYgWGICRyPYAAzfLkDsgzXMcq9nPMpz3KA5NvNAtNwMuSSEEGFQfjUDo50cDJpBENVQokBSMhoRwZhGYFkoyoy0qciQYzIo5kFgE8WD2Pwavy7sfOHdqomsTIJEcBJS3SVIa0sNUVFuKRYpoJwFJGJYhDmiAr3InjquvAUhS80TWvEo7EHUUxZErd7LBEORsIXGCkg6DVUdi+6ZE+77uL2P7nIgMAESwY9jPYCghRwA62slPNZiUL4+niUYNB6Yl-i6cQ1BXFdEmSPEsdgH7ccWmqmUJsBieFzwT3JsBKZkYHfIkqINRzB4vn+EYBnhtnpjG-ENSVVJ5S3BsjWM7xfD8d8rSFYhSuIZBKJ8Yh-AkS3XetwgeLJimrIYgDHwDC2Xf8G3Cpyh2nY9t2Y69n3ZYazyRORanRwUjRyw1zJnsizc7vMGUvnUIYOiecQkrNncQ6t8O7aj52rcPQm9no-hjzjmWKap0GaYLLEZHuTo+kse4TBGvIFEVBRFHUZY5prz268jsrG895vjzbjvQ+t325aoBXU970dblSH4OjseZRnhsZskmRUJx6IRlTrUeAW1Be0s7g8vsFnHO47LAVAeB2CwABsKHuEoT72B+HOWscM8zKCJHffQio1Y9DUCsB4Thfim30vhReYcDz+AlheB2Bw1qUxakrMG0QuZI2mMCCkXwNTDRQeoSwZ1bBiBmqPTISRP7S2-m2CQJDzx7HIYcMgyB5aK0OpKJw8hujmHkpFHh-CIo1ikPcBSjhsJDBMII7Aa8iEiIwBAPActio2ggJAvyHVZKyikNhBwGo87pAXLFWCZdFDSDlHNJgHZDJ0QDg+ZiO5AlgEMknYCzU5Fp38oYCwcwUY2BMNdZ6aoTrdXkIMa6WFhgYTmmIi8O1rx7SofE4+iTUjdVlCdcQ8RgSynnCgk6OZph5P6GIdGH0q74RKdtXalBZFHygTUus+tJqVm1OuLIEx9BJC6DMQeENpD3S+GoVwdJuAsAJvAYI4Ixn2OuLJWYNhn6rF6m-aYaoMhwR6vEToDxMiKk+i+FsNtjnKxyKsuYBYubzBujYZBCyjC9TmEqOCz8nDoz0vSHcrFCLhxtJGR0zpvm0MMEYLEFzAXXNHrclB2EYJvRWLFRwslK74MZEiz5B4OwxgmGJcZHV2ibjOsoWQSxJoFlhmqXqpg5AFlkk8YwCFqUIvwnS-cIjPynlIOIpymLJT6HmDmQoiQoaJFhtYBcz8JDMORukBQHR4XPmbLK4iwouIUSojRFVo41UQpXEYPoCxzAxFVMSlcUhB7kswfISac1UrS2VUOBJHVFFnU0LkhSlZ4jeoWaIWYCxbhyRrIkDIWz+kpSqiLUydUaqOv8goLoIq42DDsImrJTwxr3WSJNBwm54YhvzWG0W5kcp5WICWjqMwsRaXhms0YckRqlhlA2uwE1Nx4KlXmzKeNloQFWtIja7AtplI3ZQPtx0OUjDnL1Qe8QrCrERpw2S8p5BpE6LSGlTJsYUTxrujEk8kiGxmE8YEGpiS3FmH8BBvwnCxDvfOh9f8n0FvxuLSWpNZYvoQIoLo8hMGqz0RYVpExtTLIcCqfE3Kc33t-kLJdxGcZOS+RG6pDirD1rnJkT9aRanEisFiZ6SyHjyWHQLEjUHwNCygMQcxlGWUnOEPdetyoy1vGiixrmcwMh1lsCXN1RisAmOtpaBDE0OlXM6CYF5oKpKTW6KIJ5JhsKsbUxp5e9tV5xwQ8Kpw3Qh6yH+GPIzkxZScJxPETBPS4Y8Os8I8M9d7M73djvPY3su5gEc+YThBiQQmHkHWBceZTOurkqsWQXxgtRYPGFx2GmN6tzAO3Gze94vGB+LYOw3n3U-pQcKrESp7oYWeqINz+Xa4-0fTxABcBgGgO01YCcnR1XYQGIkTzqD4jlldX4zoBYOE9aXsQvwpCJH5QodI0bTjYZGEupSQet12FeMisMBwmRSwrbW6Y8M5jLHabLj8TQaQcQnUHkmgwz9TC-CUHYXxsh5ABKCRiqjrLrhHZ+LILqxg6yKHmQYTB5ZJpWEweIeGeY50BkGVuvaCH2iyXLB0R4k1ZQZEUFkhQzjpK3sinA7ZzggA */
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
        actions: "assignLibraryProp",
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
      assignLibraryProp: assign(() => {
        const queryProp = {
          queryProps: {
            field: "ID",
            direction: "DESC",
            page: 1,
            type: "music",
          },
          selectedID: null,
        };
        localStorage.setItem("queryProp", JSON.stringify(queryProp));
        return queryProp;
      }),
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
