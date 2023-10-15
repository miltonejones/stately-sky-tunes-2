import {
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NavChips from "../MusicDisplay/NavChips";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import {
  Add,
  CheckCircle,
  LibraryMusic,
  Search,
  SortByAlpha,
} from "@mui/icons-material";
import {
  GRID_QUERY_PROPS,
  LIST_IDENTIFIER,
  LIST_QUERY_PROPS,
  OFFSET_MARGIN,
  PLAYER_MARGIN,
  SORT_FIELDS,
} from "../../../constants";
import { useMenu } from "../../../machines/menuMachine";
import { createKey } from "../../../util/createKey";
import PictureCard from "../../../styled/PictureCard";
import MusicPagination from "../MusicDisplay/MusicPagination";
import Panel from "../../../styled/Panel";
import SortMenu from "./SortMenu";

export default function NavigationPanel(props) {
  const {
    detail,
    searchParam,
    musicGrid = {},
    musicProps = {},
  } = props.state.context;
  const { records: old = [], count: gridCount } = musicGrid;
  const { field, direction, type } = musicProps;
  const menu = useMenu((value) => {
    if (!value) return;
    props.send({
      type: "open",
      queryProps: {
        ...musicProps,
        field: value,
        direction: direction === "ASC" ? "DESC" : "ASC",
        page: 1,
      },
    });
  });
  const sortProps = SORT_FIELDS[type];
  const playing = props.player.state.can("stop");
  const BASE_HEIGHT = 304;
  const offset = playing
    ? BASE_HEIGHT + OFFSET_MARGIN + PLAYER_MARGIN
    : BASE_HEIGHT + OFFSET_MARGIN;

  const records = old?.map((rec, i) => {
    if (rec.Title && !rec.listKey) {
      rec.listKey = createKey(rec.Title);
    }
    return rec;
  });

  const paginationProps = {
    ...musicProps,
    ...GRID_QUERY_PROPS[type],
  };

  return (
    <>
      <Card sx={{ p: 1, overflow: "auto" }}>
        <Flex spacing={1}>
          <IconButton>
            <LibraryMusic />
          </IconButton>
          <Typography>Your Library</Typography>
          <Spacer />
          <IconButton>
            <Add />
          </IconButton>
        </Flex>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.send({ type: "search", searchParam });
          }}
        >
          <Flex sx={{ m: (theme) => theme.spacing(1, 0) }} spacing={1}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
              size="small"
              label="Search"
              value={searchParam}
              name="searchParam"
              placeholder="Find music or artists"
              onChange={(e) =>
                props.send({
                  type: "change param",
                  name: e.target.name,
                  value: e.target.value,
                })
              }
            />
            <SortMenu
              send={props.send}
              field={field}
              type={type}
              musicProps={musicProps}
              direction={direction}
            />
          </Flex>
        </form>

        <Flex sx={{ pb: 1, pt: 1 }} spacing={1}>
          <Spacer />
          <NavChips {...props} />
        </Flex>
      </Card>{" "}
      <Panel offset={offset}>
        <Stack spacing={1}>
          <MusicPagination
            state={props.state}
            send={props.send}
            count={gridCount}
            queryProps={paginationProps}
          />
          {/* <pre>{JSON.stringify(paginationProps, 0, 2)}</pre> */}
          {records.map((record) => (
            <PictureCard
              caption={
                !!record.TrackCount
                  ? `${record.TrackCount} tracks`
                  : record.artistName
              }
              src={record.Thumbnail || record.image || record.albumImage}
              title={record.Name || record.Title || record.Genre}
              onClick={() => {
                props.send({
                  type: "open",
                  queryProps: {
                    ...musicProps,
                    ...LIST_QUERY_PROPS[type],
                    page: 1,
                  },
                  selectedID: record[LIST_IDENTIFIER[type]],
                });
              }}
              active={
                !!detail &&
                record[LIST_IDENTIFIER[type]] === detail[LIST_IDENTIFIER[type]]
              }
            />
          ))}
        </Stack>
      </Panel>
    </>
  );
}
