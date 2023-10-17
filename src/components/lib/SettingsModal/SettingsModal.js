import {
  Box,
  Button,
  Dialog,
  IconButton,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useMenu } from "../../../machines/menuMachine";
import { Settings } from "@mui/icons-material";
import { ANNOUNCER_OPTIONS } from "../../../constants";
import Flex from "../../../styled/Flex";

export default function SettingsModal({ player, onClick }) {
  const menu = useMenu();
  const { cadence, options, voice } = player.state.context;

  const optionsList = {
    [ANNOUNCER_OPTIONS.BOOMBOT]: "Say station name",
    [ANNOUNCER_OPTIONS.USERNAME]: "Say logged in users name",
    [ANNOUNCER_OPTIONS.TIME]: "Mention the time",
    [ANNOUNCER_OPTIONS.UPNEXT]: "Talk about upcoming tracks",
    [ANNOUNCER_OPTIONS.RANDOM]: "Randomize DJ voices",
    [ANNOUNCER_OPTIONS.WEATHER]:
      "Current weather (requires location permission",
    [ANNOUNCER_OPTIONS.SHOW]: "Show DJ text on screen",
  };

  const handleSliderChange = (_, newValue) => {
    player.setOption("cadence", Number(newValue));
  };

  return (
    <>
      {/* <IconButton> */}
      <Settings onClick={menu.handleClick} />
      {/* </IconButton> */}
      <Dialog {...menu.menuProps} onClose={menu.handleClose()}>
        <Stack sx={{ p: 2 }}>
          <Typography variant="caption">DJ Frequency</Typography>
          <Slider
            max={1}
            min={0}
            step={0.1}
            value={cadence}
            onChange={handleSliderChange}
          />
          {Object.keys(optionsList).map((key) => (
            <Flex key={key}>
              <Switch
                onClick={() =>
                  player.setOption(
                    "options",
                    options & key
                      ? Number(options) - Number(key)
                      : Number(options) + Number(key)
                  )
                }
                checked={options & key}
              />{" "}
              {optionsList[key]}
            </Flex>
          ))}
          <Flex>
            <Button onClick={onClick} variant="contained">
              open state machines
            </Button>
          </Flex>
          {/* [{JSON.stringify({ cadence })}] [{JSON.stringify({ options })}] [
          {JSON.stringify({ voice })}] */}
        </Stack>
      </Dialog>
    </>
  );
}
