import React from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Dialog,
  Divider,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import Nowrap from "../../../styled/Nowrap";
import statePath from "../../../util/statePath";
import { ExpandLess, ExpandMore, Info } from "@mui/icons-material";
import { StateTree } from "../StateTree/StateTree";

export default function MachineDebugger({ machines }) {
  const [info, setInfo] = React.useState("");
  const [state, setState] = React.useState("");
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Dialog open={!!info} onClose={() => setInfo("")}>
        <Box sx={{ p: 2, height: 480, overflow: "auto" }}>
          {!!machines[info] && (
            <StateTree
              root
              machine={{
                ...machines[info],
                id: state,
              }}
            />
          )}
        </Box>
      </Dialog>
      <Snackbar open>
        <Card sx={{ p: 1, minWidth: 400, maxWidth: 500 }}>
          <Stack spacing={1}>
            <Typography variant="caption">Select machine:</Typography>
            <Flex spacing={1}>
              {Object.keys(machines).map((key) => (
                <Chip
                  onClick={() => setState(key)}
                  variant={state === key ? "filled" : "outlined"}
                  color="success"
                  size="small"
                  key={key}
                  label={key}
                />
              ))}
              <Spacer />
              {!!state && (
                <>
                  <IconButton onClick={() => setInfo(state)}>
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => setShow(!show)}>
                    {show ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </>
              )}
            </Flex>

            {!!state && <StatePanel show={show} attr={machines[state]} />}
          </Stack>
        </Card>
      </Snackbar>
    </>
  );
}

function StatePanel({ attr, show }) {
  const { state, send } = attr;
  const [pre, setPre] = React.useState(null);
  const activities = state.nextEvents.filter((name) => name.indexOf(".") > 0);
  return (
    <>
      <Dialog open={!!pre}>
        <Stack sx={{ p: 2 }}>
          <Box sx={{ width: 400, height: 400, overflow: "auto" }}>
            <pre>{JSON.stringify(pre, 0, 2)}</pre>
          </Box>
          <Flex>
            <Spacer />
            <Button onClick={() => setPre(null)}>Close</Button>
          </Flex>
        </Stack>
      </Dialog>
      <Divider />
      <Collapse in={show}>
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {Object.keys(state.context).map((key) => (
            <Flex sx={{ mb: 1 }}>
              <Nowrap variant="subtitle2">{key}</Nowrap>
              <Spacer />
              <Nowrap
                hover
                onClick={() => setPre(state.context[key])}
                variant="caption"
                width={300}
              >
                {JSON.stringify(state.context[key])}
              </Nowrap>
            </Flex>
          ))}
        </Box>
      </Collapse>

      <Nowrap variant="caption">
        Events in <b>{statePath(state.value)}</b> state:
      </Nowrap>
      {!!activities.length && (
        <Stack spacing={1}>
          <Nowrap variant="subtitle2">Invoking actions</Nowrap>
          {activities.map((activity) => (
            <Nowrap variant="caption">{activity}</Nowrap>
          ))}
          <LinearProgress />
        </Stack>
      )}
      <Flex spacing={1} sx={{ p: 1, width: "100%", overflow: "auto" }}>
        {state.nextEvents
          .filter((name) => name.indexOf(".") < 0)
          .map((eventName) => (
            <Chip
              onClick={() => send(eventName)}
              key={eventName}
              label={eventName}
              size="small"
              variant="outlined"
            />
          ))}
      </Flex>
    </>
  );
}
