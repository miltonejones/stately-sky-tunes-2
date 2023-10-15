import { Card, IconButton, Stack, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import { navigationIcons } from "../../../constants";

export default function NavigationCard({ send, state, events }) {
  return (
    <Card sx={{ p: 1 }}>
      <Stack>
        {Object.keys(events).map((e) => (
          <>
            <Flex onClick={() => send(e)} spacing={1}>
              <IconButton>{navigationIcons[e]}</IconButton>
              <Typography
                sx={{ textTransform: "capitalize" }}
                color={state.matches(events[e]) ? "primary" : "text.secondary"}
              >
                {e}
              </Typography>
            </Flex>
          </>
        ))}
      </Stack>
    </Card>
  );
}
