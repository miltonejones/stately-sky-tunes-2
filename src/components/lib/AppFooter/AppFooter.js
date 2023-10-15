import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { GitHub, Settings } from "@mui/icons-material";
import { navigationIcons } from "../../../constants";

const Nav = styled(Paper)(({ theme }) => ({
  position: "fixed",
  backgroundColor: "#ebebeb",
  bottom: 40,
  left: 0,
  right: 0,
  zIndex: 100,
  "@media screen and (max-width: 912px) and (orientation: landscape)": {
    display: "none",
  },
}));

export default function AppFooter({ setState, send, state, events, isMobile }) {
  const sx = { color: "white", cursor: "pointer" };
  const value = Object.keys(navigationIcons).find((e) =>
    state.matches(events[e])
  );
  return (
    <>
      <Flex
        sx={{ m: 1, position: "absolute", bottom: 0, left: 0, right: 0 }}
        between
      >
        {!isMobile && (
          <>
            <Flex spacing={2}>
              <Typography variant="caption" sx={sx}>
                About SkyTunes
              </Typography>
              <Flex spacing={1}>
                <GitHub sx={{ color: "white", width: 16, height: 16 }} />
                <Typography variant="caption" sx={sx}>
                  Githun Repo
                </Typography>
              </Flex>
            </Flex>
            <Typography variant="caption" sx={sx}>
              Powered by the <b>iTunes Search API</b>
            </Typography>
          </>
        )}

        <Flex spacing={1}>
          <Avatar
            sx={{ width: 24, height: 24 }}
            src="https://www.sky-tunes.com/assets/icon-72x72.png"
            alt="logo"
          />
          <Typography variant="caption" sx={sx}>
            <b>SkyTunes</b>. An xstate web application
          </Typography>
        </Flex>
      </Flex>
      {!!isMobile && (
        <Nav elevation={3}>
          <BottomNavigation showLabels value={value}>
            {Object.keys(navigationIcons).map((key) => (
              <BottomNavigationAction
                key={key}
                onClick={() => send(key)}
                label={key}
                icon={navigationIcons[key]}
              />
            ))}
            <BottomNavigationAction
              onClick={() => setState("debug", !state.context.debug)}
              label={`settings`}
              icon={<Settings />}
            />
          </BottomNavigation>
        </Nav>
      )}
    </>
  );
}
