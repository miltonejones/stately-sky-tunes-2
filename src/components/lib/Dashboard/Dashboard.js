import { Avatar, Box, Divider, Typography } from "@mui/material";
import DashCard from "../DashCard/DashCard";
import PictureCard from "../../../styled/PictureCard";
import moment from "moment";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { MemoryButtons } from "../MusicDisplay/MusicDisplay";
import { createKey } from "../../../util/createKey";
import { LOGO_PHOTO } from "../../../constants";

function getGreeting() {
  const currentHour = moment().hour();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning!";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
}

export default function Dashboard({
  setState,
  listman,
  state,
  send,
  isMobile,
  openList,
}) {
  const listProps = listman.state.context.playlists?.records;
  const playlistTemplateColumns = isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr";
  const groupTemplateColumns = isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr 1fr";

  return (
    <>
      <Flex spacing={1}>
        <MemoryButtons state={state} send={send} />
        <Spacer />
        <Typography variant="h6">SkyTunes</Typography>
        <Avatar
          onClick={() => setState("debug", !state.context.debug)}
          src={LOGO_PHOTO}
          alt="logo"
        />
      </Flex>
      <Flex sx={{ pb: 2 }}>
        <Typography variant="h5">{getGreeting()}</Typography>
      </Flex>
      {!!listProps && (
        <>
          {" "}
          <Divider
            textAlign="left"
            sx={{
              textTransform: "capitalize",
            }}
          >
            playlists
          </Divider>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: playlistTemplateColumns,
              gap: 1,
              p: 2,
              alignItems: "flex-start",
            }}
          >
            {listProps.slice(0, 8).map((item) => (
              <PictureCard
                src={item.image}
                title={item.Title}
                caption={`${item.TrackCount} tracks`}
                onClick={() => {
                  openList("playlist", createKey(item.Title));
                }}
              />
            ))}
          </Box>
        </>
      )}

      <Divider
        textAlign="left"
        sx={{
          textTransform: "capitalize",
        }}
      >
        top albums
      </Divider>
      <Box sx={{ display: "grid", gridTemplateColumns: groupTemplateColumns }}>
        {!!state.context.dashboard &&
          state.context.dashboard
            .filter((f) => f.Type === "album")
            .slice(0, 10)
            .map((item) => (
              <DashCard
                onClick={() => {
                  openList("album", item.ID);
                }}
                key={item.ID}
                item={item}
              />
            ))}
      </Box>
      <Divider
        textAlign="left"
        sx={{
          textTransform: "capitalize",
        }}
      >
        top artists
      </Divider>
      <Box sx={{ display: "grid", gridTemplateColumns: groupTemplateColumns }}>
        {!!state.context.dashboard &&
          state.context.dashboard
            .filter((f) => f.Type === "artist")
            .slice(0, 10)
            .map((item) => (
              <DashCard
                onClick={() => {
                  openList("artist", item.ID);
                }}
                item={item}
              />
            ))}
      </Box>
    </>
  );
}
