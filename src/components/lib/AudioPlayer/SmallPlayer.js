import {
  Box,
  Card,
  Fab,
  IconButton,
  LinearProgress,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { Picture } from "../../../hooks/useImage";
import Nowrap from "../../../styled/Nowrap";
import statePath from "../../../util/statePath";
import { Close, PauseCircle, PlayCircle } from "@mui/icons-material";
import TracklistDrawer from "./TracklistDrawer";
import SwapBox from "./SwapBox";

export default function SmallPlayer(props) {
  const { player } = props;
  const {
    track = {},
    current_time_formatted,
    duration_formatted,
    progress,
  } = player.state.context;
  const handleChange = (_, newValue) => {
    player.send({
      type: "seek",
      value: newValue / 100,
    });
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 96,
          left: 0,
          m: 1,
          width: "calc(100vw - 16px)",
        }}
      >
        <Card sx={{ p: 1 }}>
          <Flex spacing={1}>
            <SwapBox image={track.albumImage} title={track.Title} />

            <Stack
              sx={{
                width: `calc(100vw - 148px)`,
              }}
            >
              <Flex spacing={2} sx={{ width: 400 }}>
                <Typography variant="caption">
                  {current_time_formatted}
                </Typography>
                {player.state.can("pause") && (
                  <Slider
                    sx={{ width: `calc(100vw - 248px)` }}
                    min={0}
                    onChange={handleChange}
                    max={100}
                    value={Math.floor(progress)}
                  />
                )}
                {!player.state.can("pause") && (
                  <Stack>
                    <LinearProgress
                      sx={{ width: `calc(100vw - 248px)` }}
                      variant="indeterminate"
                    />
                    <Nowrap variant="caption">
                      {statePath(player.state.value)}
                    </Nowrap>
                  </Stack>
                )}
                <Typography variant="caption">{duration_formatted}</Typography>
              </Flex>

              <Flex sx={{ alignItems: "flex-end" }}>
                <Stack
                  sx={{
                    width: "calc(100% - 40px)",
                  }}
                >
                  <Nowrap variant="body2">{track.Title}</Nowrap>
                  <Nowrap variant="caption">{track.albumName}</Nowrap>
                </Stack>
                {!!player.state.can("pause") && (
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => player.send("pause")}
                  >
                    <PauseCircle />
                  </Fab>
                )}
                {!!player.state.can("resume") && (
                  <Fab
                    size="small"
                    color="error"
                    onClick={() => player.send("resume")}
                  >
                    <PlayCircle />
                  </Fab>
                )}
              </Flex>
            </Stack>

            <Stack>
              <IconButton onClick={() => player.send("stop")}>
                <Close />
              </IconButton>

              <TracklistDrawer player={player} />
            </Stack>
          </Flex>
        </Card>
      </Box>
    </>
  );
}
