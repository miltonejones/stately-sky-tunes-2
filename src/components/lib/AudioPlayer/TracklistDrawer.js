import { Card, Drawer, IconButton, Stack } from "@mui/material";
import { useMenu } from "../../../machines/menuMachine";
import { Checklist } from "@mui/icons-material";
import Nowrap from "../../../styled/Nowrap";
import { OFFSET_MARGIN } from "../../../constants";
import Panel from "../../../styled/Panel";
import { Picture } from "../../../hooks/useImage";
import Flex from "../../../styled/Flex";

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
            minWidth: "25vw",
            height: "100vh",
            p: 1,
            backgroundColor: (theme) => theme.palette.primary.dark,
          }}
          spacing={1}
        >
          <Panel offset={OFFSET_MARGIN - 24}>
            <Stack spacing={1}>
              {trackList.map((track) => (
                <Flex
                  spacing={1}
                  onClick={menu.handleClose(track)}
                  key={track.ID}
                >
                  <Picture
                    src={track.albumImage}
                    alt={track.Title}
                    style={{ width: 40, height: 40 }}
                  />
                  <Stack>
                    <Nowrap
                      width={300}
                      hover
                      bold={track.ID === player.state.context.track?.ID}
                    >
                      {track.Title}
                    </Nowrap>
                    <Nowrap variant="caption">
                      {[track.artistName, track.albumName]
                        .filter((f) => !!f)
                        .join(" - ")}
                    </Nowrap>
                  </Stack>
                </Flex>
              ))}
            </Stack>
          </Panel>
        </Stack>
      </Drawer>
    </>
  );
}
