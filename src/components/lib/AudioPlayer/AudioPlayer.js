import React from "react";
import {
  Box,
  Card,
  IconButton,
  LinearProgress,
  Slider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Equalizer from "../../../styled/Equalizer";
import Nowrap from "../../../styled/Nowrap";
import {
  NavigateNext,
  PauseCircle,
  PlayCircle,
  SmartToy,
  Stop,
} from "@mui/icons-material";
import statePath from "../../../util/statePath";
import SmallPlayer from "./SmallPlayer";
import TracklistDrawer from "./TracklistDrawer";

export default function AudioPlayer(props) {
  const { player, isMobile } = props;
  const { intro, silent } = player.state.context;
  const Component = isMobile ? SmallPlayer : AudioPlayerBody;
  if (!player.state.can("stop")) return <i />;
  return (
    <>
      <Snackbar
        open={!silent}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {!!intro && (
          <Card sx={{ p: 2, width: 500 }}>
            <Flex spacing={1} sx={{ alignItems: "flex-start" }}>
              <SmartToy />
              <Typography variant="caption">{intro.Introduction}</Typography>
            </Flex>
          </Card>
        )}
      </Snackbar>

      <Component {...props} />
    </>
  );
}

function AudioPlayerBody(props) {
  const { player } = props;
  const {
    track = {},
    current_time_formatted,
    duration_formatted,
    progress,
    coords,
    intro,
    silent,
  } = player.state.context;

  const [image, setImage] = React.useState(
    "https://www.sky-tunes.com/assets/default_album_cover.jpg"
  );
  React.useEffect(() => {
    if (!track) return;
    const im = new Image();
    im.onload = () => setImage(track.albumImage);
    im.onerror = () =>
      setImage("https://www.sky-tunes.com/assets/default_album_cover.jpg");
    im.src = track.albumImage;
  }, [track]);
  const buttons = {
    pause: <PauseCircle />,
    resume: <PlayCircle />,
    END: <NavigateNext />,
    stop: <Stop />,
  };
  const handleChange = (_, newValue) => {
    player.send({
      type: "seek",
      value: newValue / 100,
    });
  };

  if (!track) return <i />;
  if (!player.state.can("stop")) return <i />;

  return (
    <>
      <Snackbar
        open={!silent}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {!!intro && (
          <Card sx={{ p: 2, width: 500 }}>
            <Flex spacing={1} sx={{ alignItems: "flex-start" }}>
              <SmartToy />
              <Typography variant="caption">{intro.Introduction}</Typography>
            </Flex>
          </Card>
        )}
      </Snackbar>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
        }}
      >
        <Card sx={{ p: 2 }}>
          <Flex spacing={2}>
            <Flex spacing={1} sx={{ alignItems: "flex-start", width: 420 }}>
              <img
                src={image}
                alt={track.Title}
                style={{
                  width: 64,
                  height: 64,
                }}
              />
              <Stack>
                <Nowrap width={300} variant="body2">
                  {track.Title}
                </Nowrap>
                <Nowrap width={300} variant="caption">
                  {track.artistName}
                </Nowrap>
                <Nowrap width={300} variant="caption">
                  {track.albumName}
                </Nowrap>
              </Stack>
            </Flex>
            <TracklistDrawer player={player} />
            {Object.keys(buttons)
              .filter((action) => player.state.can(action))
              .map((action) => (
                <IconButton onClick={() => player.send(action)}>
                  {buttons[action]}
                </IconButton>
              ))}

            <Flex spacing={2} sx={{ width: 400 }}>
              <Typography variant="caption">
                {current_time_formatted}
              </Typography>
              {player.state.can("pause") && (
                <Slider
                  sx={{ width: 300 }}
                  min={0}
                  onChange={handleChange}
                  max={100}
                  value={Math.floor(progress)}
                />
              )}
              {!player.state.can("pause") && (
                <Stack>
                  <LinearProgress sx={{ width: 300 }} variant="indeterminate" />
                  <Nowrap variant="caption">
                    {statePath(player.state.value)}
                  </Nowrap>
                </Stack>
              )}
              <Typography variant="caption">{duration_formatted}</Typography>
            </Flex>

            {!!coords && <Equalizer width={300} coords={coords} />}
          </Flex>
        </Card>
      </Box>
      {/* </Drawer> */}
    </>
  );
}
