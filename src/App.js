import "./App.css";
import { useMusic } from "./machines/musicMachine";
import {
  Box,
  Card,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Dashboard from "./components/lib/Dashboard/Dashboard";
import SearchResults from "./components/lib/SearchResults/SearchResults";
import MusicDisplay from "./components/lib/MusicDisplay/MusicDisplay";
import AudioPlayer from "./components/lib/AudioPlayer/AudioPlayer";
import NavigationPanel from "./components/lib/NavigationPanel/NavigationPanel";
import Flex from "./styled/Flex";
import MachineDebugger from "./components/lib/MachineDebugger/MachineDebugger";
import PlaylistDrawer from "./components/lib/PlaylistDrawer/PlaylistDrawer";
import { useTrack } from "./machines/trackMachine";
import TrackDrawer from "./components/lib/TrackDrawer/TrackDrawer";
import { navigationIcons, OFFSET_MARGIN, PLAYER_MARGIN } from "./constants";
import AppFooter from "./components/lib/AppFooter/AppFooter";
import NavigationCard from "./components/lib/NavigationPanel/NavigationCard";
import Panel from "./styled/Panel";

function App() {
  const musician = useMusic();
  const tracker = useTrack(musician);
  const {
    listman,
    debug,
    state,
    player,
    send,
    events,
    setState,
    count,
    records,
    openList,
    refreshList,
    states,
    isMobile,
    rotated,
  } = musician;

  const props = {
    tracker,
    listman,
    state,
    player,
    send,
    records,
    setState,
    count,
    openList,
    refreshList,
    isMobile,
    rotated,
    events,
  };

  const machines = {
    Playlist: listman,
    "Music Player": player,
    Application: { state, states, send },
    Announcer: player.announcer,
  };
  const playing = player.state.can("stop");
  let offset = playing ? OFFSET_MARGIN + PLAYER_MARGIN : OFFSET_MARGIN;
  if (isMobile) {
    offset += playing ? 104 : 64;
  }
  return (
    <>
      <Box sx={{ m: 1 }}>
        <PlaylistDrawer {...props} />
        <TrackDrawer tracker={tracker} />
        {!!debug && <MachineDebugger machines={machines} />}

        <Grid container spacing={1}>
          {!isMobile && (
            <Grid item xs={3}>
              <Stack spacing={1}>
                <NavigationCard {...props} />
                <NavigationPanel {...props} />
              </Stack>
            </Grid>
          )}
          <Grid item xs={isMobile ? 12 : 9}>
            <Panel offset={offset}>
              {state.matches("load music list") && <LinearProgress />}
              {state.matches("dashboard view.ready") && (
                <Dashboard {...props} />
              )}
              {state.matches("music search view") && (
                <SearchResults {...props} />
              )}
              {state.matches("display music list") && (
                <MusicDisplay {...props} />
              )}
            </Panel>
          </Grid>
        </Grid>
        <AppFooter {...props} />
      </Box>

      <AudioPlayer {...props} />
    </>
  );
}

export default App;
