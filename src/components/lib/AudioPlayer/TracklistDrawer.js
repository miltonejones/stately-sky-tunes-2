import { Card, Drawer, IconButton, Stack } from "@mui/material";
import { useMenu } from "../../../machines/menuMachine";
import { Checklist } from "@mui/icons-material";
import Nowrap from "../../../styled/Nowrap";
import { OFFSET_MARGIN } from "../../../constants";

export default function TracklistDrawer({ player }) {
  const { trackList } = player.state.context;
  const menu = useMenu((value) => !!value && player.play(value, trackList));

  if (!trackList) return <i />;

  return (
    <>
      <IconButton onClick={menu.handleClick}>
        <Checklist />
      </IconButton>

      <Drawer {...menu.menuProps}>
        <Stack
          sx={{
            width: 400,
            height: "100vh",
            p: 1,
            backgroundColor: (theme) => theme.palette.primary.dark,
          }}
          spacing={1}
        >
          <Card
            sx={{
              p: 1,
              height: `calc(100vh - ${OFFSET_MARGIN + 8}px)`,
              overflow: "auto",
            }}
          >
            {trackList.map((track) => (
              <Nowrap
                onClick={menu.handleClose(track)}
                bold={track.ID === player.state.context.track?.ID}
                key={track.ID}
              >
                {track.Title}
              </Nowrap>
            ))}
          </Card>
        </Stack>
      </Drawer>
    </>
  );
}