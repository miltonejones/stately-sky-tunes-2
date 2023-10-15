import {
  Box,
  Button,
  Card,
  Drawer,
  IconButton,
  LinearProgress,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { Add, Favorite, FavoriteBorder } from "@mui/icons-material";
import Nowrap from "../../../styled/Nowrap";
import { createKey } from "../../../util/createKey";
import { useMenu } from "../../../machines/menuMachine";
import { OFFSET_MARGIN } from "../../../constants";

export default function PlaylistDrawer(props) {
  const menu = useMenu((name) => !!name && props.listman.create(name));
  const { playlists, track } = props.listman.state.context;
  if (!track) return <i />;

  const BASE_HEIGHT = 88;
  const offset = BASE_HEIGHT + OFFSET_MARGIN;

  return (
    <>
      <Popover {...menu.menuProps}>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Typography>Create new playlist</Typography>
          <TextField
            size="small"
            name="value"
            label="List name"
            onChange={menu.handleChange}
            value={menu.value}
          />
          <Flex>
            <Spacer />
            <Button variant="contained" onClick={menu.handleClose(menu.value)}>
              save
            </Button>
          </Flex>
        </Stack>
      </Popover>

      <Drawer
        open={props.listman.state.can("close")}
        anchor="left"
        onClose={() => props.listman.send("close")}
      >
        <Stack
          sx={{
            minWidth: 400,
            height: "100vh",
            p: 1,
            backgroundColor: (theme) => theme.palette.primary.dark,
          }}
          spacing={1}
        >
          <Card sx={{ p: 1 }}>
            {!props.listman.state.can("add") && <LinearProgress />}
            <Stack>
              <Flex>
                <Typography>Playlists</Typography>
                <Spacer />
                <IconButton onClick={menu.handleClick}>
                  <Add />
                </IconButton>
              </Flex>
              <Nowrap variant="caption">
                Add <b>{track.Title}</b> to:
              </Nowrap>
            </Stack>
          </Card>

          <Card
            sx={{ p: 1, height: `calc(100vh - ${offset}px)`, overflow: "auto" }}
          >
            {!!playlists.records &&
              playlists.records.map((playlist, i) => (
                <Flex key={i}>
                  <Typography>{playlist.Title}</Typography>
                  <Spacer />
                  <Box
                    onClick={() => props.listman.add(createKey(playlist.Title))}
                  >
                    {playlist.related.indexOf(track.FileKey) > -1 ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </Box>
                </Flex>
              ))}
          </Card>
        </Stack>
      </Drawer>
    </>
  );
}
