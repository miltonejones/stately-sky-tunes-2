import {
  Avatar,
  Box,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import DashCard from "../DashCard/DashCard";
import PictureCard from "../../../styled/PictureCard";
import moment from "moment";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { MemoryButtons } from "../MusicDisplay/MusicDisplay";
import { createKey } from "../../../util/createKey";
import { LOGO_PHOTO } from "../../../constants";
import playlistSort from "../../../util/playlistSort";
import { Album, Checklist, Person } from "@mui/icons-material";
import S3Uploader from "../S3Uploader/S3Uploader";

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
  playList,
  openGrid,
}) {
  const listProps = playlistSort(listman.state.context.playlists?.records);
  const playlistTemplateColumns = isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr";
  const groupTemplateColumns = isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr 1fr";

  return (
    <>
      {!state.can("play") && <LinearProgress />}
      <Flex spacing={1}>
        <MemoryButtons state={state} send={send} />
        <Spacer />
        {/* <S3Uploader /> */}
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
          <Flex spacing={2}>
            <Divider
              textAlign="left"
              sx={{
                width: "calc(100% - 80px)",
                textTransform: "capitalize",
              }}
            >
              <Flex spacing={1}>
                <Checklist />
                playlists
              </Flex>
            </Divider>
            <Typography
              onClick={() => openGrid("playlist")}
              variant="subtitle2"
            >
              show all
            </Typography>
          </Flex>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: playlistTemplateColumns,
              gap: 1,
              p: 2,
              alignItems: "flex-start",
            }}
          >
            {listProps.slice(0, 8).map((item, i) => (
              <PictureCard
                bold={i === 0}
                key={i}
                src={item.image}
                title={item.Title}
                caption={`${item.TrackCount} tracks`}
                onPlay={() => {
                  playList("playlist", createKey(item.Title));
                }}
                onClick={() => {
                  openList("playlist", createKey(item.Title));
                }}
              />
            ))}
          </Box>
        </>
      )}

      <Flex spacing={2}>
        <Divider
          textAlign="left"
          sx={{
            textTransform: "capitalize",
            width: "calc(100% - 80px)",
          }}
        >
          <Flex spacing={1}>
            <Album />
            top albums
          </Flex>
        </Divider>
        <Typography onClick={() => openGrid("album")} variant="subtitle2">
          show all
        </Typography>
      </Flex>
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
                onPlay={() => {
                  playList("album", item.ID);
                }}
                key={item.ID}
                item={item}
              />
            ))}
      </Box>
      <Flex spacing={2}>
        <Divider
          textAlign="left"
          sx={{
            textTransform: "capitalize",
            width: "calc(100% - 80px)",
          }}
        >
          <Flex spacing={1}>
            <Person />
            top artists
          </Flex>
        </Divider>
        <Typography onClick={() => openGrid("artist")} variant="subtitle2">
          show all
        </Typography>
      </Flex>
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
                onPlay={() => {
                  playList("artist", item.ID);
                }}
                item={item}
              />
            ))}
      </Box>
    </>
  );
}
