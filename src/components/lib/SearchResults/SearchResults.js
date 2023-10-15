import {
  Avatar,
  Card,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MusicList from "../MusicList/MusicList";
import MusicGrid from "../MusicGrid/MusicGrid";
import { Search } from "@mui/icons-material";
import Flex from "../../../styled/Flex";
import { MemoryButtons } from "../MusicDisplay/MusicDisplay";
import MusicListBreadcrumbs from "../MusicList/MusicListBreadcrumbs";
import Spacer from "../../../styled/Spacer";

export default function SearchResults(props) {
  const { state, send, setState, isMobile } = props;
  const { searchParam, searchResults, search_index } = state.context;
  const currentKey = Object.keys(searchResults)[search_index];
  return (
    <>
      {!!isMobile && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send({ type: "search", searchParam });
          }}
        >
          <Card sx={{ m: 1, p: 1 }}>
            <Flex spacing={1} sx={{ mb: 1 }}>
              <MemoryButtons {...props} />

              <MusicListBreadcrumbs {...props} />
              <Spacer />
              <Typography variant={isMobile ? "subtitle2" : "h6"}>
                SkyTunes
              </Typography>
              <Avatar
                onClick={() => setState("debug", !state.context.debug)}
                src="https://www.sky-tunes.com/assets/icon-72x72.png"
                alt="logo"
              />
            </Flex>

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
                send({
                  type: "change param",
                  name: e.target.name,
                  value: e.target.value,
                })
              }
            />
          </Card>
        </form>
      )}
      {/* {JSON.stringify(state.value)} */}
      <Stack direction="row" spacing={1} sx={{ p: 2 }}>
        {Object.keys(searchResults).map((key, i) => (
          <Chip
            onClick={() => setState("search_index", i)}
            size="small"
            variant={search_index === i ? "filled" : "outlined"}
            color="primary"
            label={`${key} (${state.context.searchResults[key].records.length})`}
            key={key}
          />
        ))}
      </Stack>

      {currentKey === "music" && searchResults[currentKey] && (
        <MusicList {...props} records={searchResults[currentKey].records} />
      )}
      {currentKey !== "music" && searchResults[currentKey] && (
        <MusicGrid {...props} records={searchResults[currentKey].records} />
      )}

      {/* <pre>{JSON.stringify(state.context.searchResults[currentKey], 0, 2)}</pre> */}
    </>
  );
}
