import React from "react";
import {
  Box,
  Card,
  CircularProgress,
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
  Close,
  Favorite,
  FavoriteBorder,
  PauseCircle,
  PlayCircle,
  Repeat,
  RepeatOn,
  Shuffle,
  ShuffleOn,
  SkipNext,
  SkipPrevious,
  SmartToy,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import statePath from "../../../util/statePath";
import SmallPlayer from "./SmallPlayer";
import TracklistDrawer from "./TracklistDrawer";
import { ANNOUNCER_OPTIONS, COVER_ART_IMAGE } from "../../../constants";
import Spacer from "../../../styled/Spacer";
import { useImageSwap } from "../../../machines/imageswapMachine";
import SwapBox from "./SwapBox";

export default function AudioPlayer(props) {
  const { player, isMobile } = props;
  const { intro, silent } = player.state.context;
  const Component = isMobile ? SmallPlayer : AudioPlayerBody;
  if (!player.state.can("stop")) return <i />;
  const showAnnouncements =
    ANNOUNCER_OPTIONS.SHOW & player.state.context.options;
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={
          player.announcer.state.can("append") && !!silent && showAnnouncements
        }
      >
        <Card sx={{ p: 2, width: 500 }}>
          <Flex spacing={1}>
            <CircularProgress size={18} />
            <Nowrap width={160} variant="caption">
              Getting introductions
            </Nowrap>
            <Spacer />
            <IconButton
              onClick={() =>
                player.setOption(
                  "options",
                  player.state.context.options & ANNOUNCER_OPTIONS.SHOW
                    ? Number(player.state.context.options) -
                        ANNOUNCER_OPTIONS.SHOW
                    : Number(player.state.context.options) +
                        ANNOUNCER_OPTIONS.SHOW
                )
              }
            >
              <Close />
            </IconButton>
          </Flex>
          {!!player.announcer.state.context.progress && (
            <LinearProgress
              variant="determinate"
              value={player.announcer.state.context.progress}
            />
          )}
          <Flex spacing={1}>
            <Nowrap variant="body2">
              {player.announcer.state.context.title}
            </Nowrap>
          </Flex>
          <Typography sx={{ width: 400 }} component={"code"} variant="caption">
            {player.announcer.state.context.announcementText}
          </Typography>
        </Card>
      </Snackbar>
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
  const { player, listman } = props;
  const {
    track = {},
    current_time_formatted,
    duration_formatted,
    progress,
    coords,
    volume,
  } = player.state.context;
  const swap = useImageSwap();
  const swapping = swap.state.matches("swapping");
  const idleClassName = swapping
    ? "photo-swappable image-swapped swapping"
    : "photo-swappable image-idle";
  const swapClassName = swapping
    ? "photo-swappable image-idle swapping"
    : "photo-swappable image-standby";

  const [image, setImage] = React.useState(COVER_ART_IMAGE);
  // React.useEffect(() => {
  //   if (!track) return;
  //   const im = new Image();
  //   im.onload = () => setImage(track.albumImage);
  //   im.onerror = () => setImage(COVER_ART_IMAGE);
  //   im.src = track.albumImage;
  // }, [track]);
  React.useEffect(() => {
    const type = swap.state.can("swap") ? "swap" : "init";
    swap.send({
      type,
      pic: track.albumImage,
    });
  }, [track]);
  const buttons = {
    PREVIOUS: <SkipPrevious />,
    pause: <PauseCircle />,
    resume: <PlayCircle />,
    END: <SkipNext />,
    // stop: <Stop />,
  };
  const handleLouder = (_, newValue) => {
    // return alert(newValue);
    player.send({
      type: "louder",
      volume: newValue,
    });
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
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
        }}
      >
        <Card sx={{ p: 2 }}>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            <Flex>
              <Flex
                spacing={1}
                sx={{ alignItems: "flex-start", width: "100%" }}
              >
                <SwapBox image={track.albumImage} title={track.Title} />

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
              <IconButton
                onClick={() =>
                  listman.send({
                    type: "open",
                    track,
                  })
                }
              >
                {" "}
                {listman.contains(track) ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </Flex>

            <Stack>
              <Flex sx={{ justifyContent: "center" }} spacing={1}>
                {player.state.can("toggle") && (
                  <IconButton
                    color={player.state.context.shuffle ? "primary" : "inherit"}
                    onClick={() =>
                      player.send({
                        type: "toggle",
                        prop: "shuffle",
                      })
                    }
                  >
                    {player.state.context.shuffle ? <ShuffleOn /> : <Shuffle />}
                  </IconButton>
                )}
                {Object.keys(buttons)
                  .filter((action) => player.state.can(action))
                  .map((action) => (
                    <IconButton
                      color={"inherit"}
                      onClick={() => player.send(action)}
                      sx={{
                        backgroundColor: (theme) =>
                          ["pause", "resume"].some((name) => action === name)
                            ? `${theme.palette.primary.main}`
                            : "",
                      }}
                    >
                      {buttons[action]}
                    </IconButton>
                  ))}
                {player.state.can("toggle") && (
                  <IconButton
                    color={player.state.context.repeat ? "primary" : "inherit"}
                    onClick={() =>
                      player.send({
                        type: "toggle",
                        prop: "repeat",
                      })
                    }
                  >
                    {player.state.context.repeat ? <RepeatOn /> : <Repeat />}
                  </IconButton>
                )}
              </Flex>

              <Flex spacing={2} sx={{ width: "100%" }}>
                <Typography variant="caption">
                  {current_time_formatted}
                </Typography>

                {player.state.can("pause") && (
                  <Slider
                    min={0}
                    onChange={handleChange}
                    max={100}
                    value={Math.floor(progress)}
                  />
                )}

                {!player.state.can("pause") && (
                  <Stack sx={{ width: "100%", p: 1, mt: 1 }}>
                    <Flex>
                      <LinearProgress
                        sx={{ width: "100%" }}
                        variant="indeterminate"
                      />
                    </Flex>
                    {/* <Nowrap variant="caption">
                      {statePath(player.state.value)}
                    </Nowrap> */}
                  </Stack>
                )}

                <Typography variant="caption">{duration_formatted}</Typography>
              </Flex>
            </Stack>

            <Flex>
              <IconButton
                color={volume === 0 ? "primary" : "inherit"}
                onClick={() => handleLouder(null, 0)}
              >
                {volume === 0 ? <VolumeOff /> : <VolumeUp />}
              </IconButton>

              <Slider
                sx={{ width: 80 }}
                min={0}
                onChange={handleLouder}
                step={0.1}
                max={1}
                value={volume}
              />
              <Spacer />
              {!!coords && <Equalizer width={300} coords={coords} />}
              <IconButton
                sx={{ width: 18, height: 18 }}
                onClick={() => player.send("stop")}
              >
                <Close sx={{ width: 16, height: 16 }} />
              </IconButton>
            </Flex>
          </Box>
        </Card>
      </Box>
      {/* </Drawer> */}
    </>
  );
}
