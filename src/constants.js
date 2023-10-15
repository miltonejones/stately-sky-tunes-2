import {
  Album,
  Checklist,
  Home,
  LibraryMusic,
  LocalOffer,
  Person,
  Search,
} from "@mui/icons-material";

export const API_ENDPOINT =
  "https://u8m0btl997.execute-api.us-east-1.amazonaws.com";

export const GRID_QUERY_PROPS = {
  album: { field: "Name", direction: "ASC" },
  artist: { field: "Name", direction: "ASC" },
  genre: { field: "Genre", direction: "ASC" },
  playlist: { field: "Title", direction: "DESC" },
};

export const LIST_QUERY_PROPS = {
  album: { field: "albumFk,discNumber,trackNumber", direction: "ASC" },
  artist: { field: "discNumber,trackNumber", direction: "ASC" },
  genre: { field: "artistName", direction: "ASC" },
  playlist: { field: "trackNumber", direction: "DESC" },
};

export const LIST_IDENTIFIER = {
  album: "ID",
  artist: "ID",
  genre: "ID",
  playlist: "listKey",
};

export const SORT_FIELDS = {
  album: {
    Name: "Name",
    Count: "TrackCount",
  },
  artist: {
    Name: "Name",
    Count: "TrackCount",
  },
  genre: {
    Name: "Genre",
    Count: "TrackCount",
  },
  playlist: {
    Name: "Title",
    Count: "TrackCount",
  },
};

export const OFFSET_MARGIN = 64;
export const PLAYER_MARGIN = 64;

export const navigationIcons = {
  home: <Home />,
  library: <LibraryMusic />,
  search: <Search />,
};

export const queryTypeIcons = {
  album: <Album />,
  artist: <Person />,
  genre: <LocalOffer />,
  playlist: <Checklist />,
};
