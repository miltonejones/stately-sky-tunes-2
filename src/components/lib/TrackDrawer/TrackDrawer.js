import { Card, Collapse, Drawer, Stack, Typography } from "@mui/material";
import { useImage } from "../../../hooks/useImage";
import Flex from "../../../styled/Flex";
import { LIST_QUERY_PROPS, OFFSET_MARGIN } from "../../../constants";
import Nowrap from "../../../styled/Nowrap";
import {
  Album,
  Apple,
  Checklist,
  LocalOffer,
  Person,
  PlaylistAddCircle,
} from "@mui/icons-material";
import { useCurator } from "../../../machines/curatorMachine";
import CuratorCollapse from "./CuratorCollapse";
import Panel from "../../../styled/Panel";

export default function TrackDrawer({ tracker }) {
  const curator = useCurator(() => tracker.machine.refreshList());
  const { track } = tracker.state.context;
  const { source } = useImage(track?.albumImage);
  const actions = [
    {
      title: "View Artist",
      caption: track.artistName,
      type: "artist",
      field: "artistFk",
      icon: <Person />,
    },
    {
      title: "View Album",
      caption: track.albumName,
      type: "album",
      field: "albumFk",
      icon: <Album />,
    },
    {
      title: "View Genre",
      caption: track.Genre,
      type: "genre",
      field: "Genre",
      icon: <LocalOffer />,
    },
    {
      title: "Add to playlist",
      caption: "Save this song to a playlist",
      icon: <PlaylistAddCircle />,
      action: () => {
        tracker.machine.listman.send({
          type: "open",
          track,
        });
        tracker.send("close");
      },
    },
    {
      title: "Add to queue",
      caption: "Play this song next",
      icon: <Checklist />,
      action: () => {
        tracker.machine.player.send({
          type: "insert",
          track,
        });
        tracker.send("close");
      },
    },
  ];

  const execute = (action) => {
    if (action.action) {
      return action.action();
    }
    tracker.tell({
      type: "open",
      queryProps: {
        ...LIST_QUERY_PROPS[action.type],
        page: 1,
        type: action.type,
      },
      selectedID: track[action.field],
    });
  };

  const BASE_HEIGHT = 96;
  const offset = BASE_HEIGHT + OFFSET_MARGIN;
  return (
    <Drawer
      anchor="right"
      open={!tracker.state.can("open")}
      onClose={() => tracker.send("close")}
    >
      <Stack
        sx={{
          width: 400,
          height: "100vh",
          p: 1,
          backgroundColor: (theme) => theme.palette.primary.dark,
        }}
        spacing={1}
      >
        <Card sx={{ p: 1 }}>
          <Flex spacing={1} baseline>
            <img
              src={source}
              style={{ width: 100, height: 100 }}
              alt={track.Title}
            />
            <Stack>
              <Typography>{track.Title}</Typography>
              <Typography variant="caption">
                {track.artistName} ({track.artistFk})
              </Typography>
            </Stack>
          </Flex>
        </Card>
        <Panel offset={offset}>
          <Collapse in={curator.state.can("open")}>
            {actions.map((action) => (
              <Flex>
                {action.icon}
                <Stack
                  sx={{ m: 1 }}
                  key={action.title}
                  onClick={() => execute(action)}
                >
                  <Nowrap hover> {action.title}</Nowrap>
                  <Nowrap color="text.secondary" variant="caption">
                    {" "}
                    {action.caption}
                  </Nowrap>
                </Stack>
              </Flex>
            ))}

            <Flex
              onClick={() =>
                curator.send({
                  type: "open",
                  track,
                })
              }
            >
              <Apple />
              <Stack sx={{ m: 1 }}>
                <Nowrap hover> Find on iTunes</Nowrap>
                <Nowrap color="text.secondary" variant="caption">
                  {" "}
                  Look up item details on iTunes.com
                </Nowrap>
              </Stack>
            </Flex>
          </Collapse>
          <CuratorCollapse curator={curator} />
        </Panel>
      </Stack>
    </Drawer>
  );
}
