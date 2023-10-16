import { Avatar, Box, Stack, Typography } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import MusicListHeader from "./MusicListHeader";
import { Favorite, FavoriteBorder, MoreVert } from "@mui/icons-material";
import moment from "moment";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";

export default function MusicList({
  tracker,
  listman,
  player,
  records,
  state,
  openList,
  isMobile,
  rotated,
}) {
  if (isMobile) {
    const sx = rotated
      ? { p: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }
      : { p: 1 };
    return (
      <Box sx={sx}>
        {records?.map((record) => (
          <Stack
            sx={{
              pb: 1,
              width: rotated ? "calc(33vw - 16px)" : "calc(100vw - 16px)",
            }}
          >
            <Flex spacing={1}>
              <Avatar
                sx={{ width: 30, height: 30 }}
                src={record.albumImage}
                alt={record.Title}
              />
              <Nowrap
                width={300}
                onClick={() => player.play(record, records)}
                hover
                variant="body2"
                bold={record.FileKey === player.state.context.track?.FileKey}
              >
                {record.Title}
              </Nowrap>
              <Spacer />{" "}
              <Box
                onClick={() =>
                  listman.send({
                    type: "open",
                    track: record,
                  })
                }
              >
                {listman.contains(record) ? <Favorite /> : <FavoriteBorder />}
              </Box>
              <Box
                onClick={() =>
                  tracker.send({
                    type: "open",
                    track: record,
                  })
                }
              >
                <MoreVert />
              </Box>
            </Flex>
            <Nowrap
              hover
              variant="caption"
              onClick={() => {
                openList("album", record.albumFk);
              }}
            >
              {record.albumName}
            </Nowrap>
            <Nowrap
              hover
              variant="caption"
              onClick={() => {
                openList("artist", record.artistFk);
              }}
            >
              {record.artistName}
            </Nowrap>
          </Stack>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {!!state.context.displayArtist && !isMobile && (
        <MusicListHeader
          type={state.context.queryProps.type}
          artist={state.context.displayArtist[0]}
        />
      )}{" "}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 1fr 1fr 1fr 1fr 32px 32px",
          gap: 1,
          p: 1,
          mt: 2,
        }}
      >
        <Box />
        <Typography variant="subtitle2">Title</Typography>
        <Typography variant="subtitle2">Artist</Typography>
        <Typography variant="subtitle2">Album</Typography>
        <Typography variant="subtitle2">Genre</Typography>
        <Typography variant="subtitle2">Time</Typography>
        <FavoriteBorder />
        <Box />
      </Box>
      <Stack spacing={1}>
        {records?.map((record) => (
          <Box
            key={record.ID}
            sx={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 1fr 1fr 1fr 1fr 32px 32px",
              gap: 1,
              p: 1,
              alignItems: "center",
              backgroundColor: (theme) =>
                record.FileKey === player.state.context.track?.FileKey
                  ? theme.palette.grey[100]
                  : theme.palette.common.white,
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30 }}
              src={record.albumImage}
              alt={record.Title}
            />
            <Nowrap
              onClick={() => player.play(record, records)}
              hover
              variant="body2"
              bold={record.FileKey === player.state.context.track?.FileKey}
            >
              {record.Title}
            </Nowrap>
            <Nowrap
              hover
              variant="body2"
              onClick={() => {
                openList("artist", record.artistFk);
              }}
            >
              {record.artistName}
            </Nowrap>
            <Nowrap
              hover
              variant="body2"
              onClick={() => {
                openList("album", record.albumFk);
              }}
            >
              {record.albumName}
            </Nowrap>
            <Nowrap
              hover
              variant="body2"
              onClick={() => {
                openList("genre", record.Genre);
              }}
            >
              {record.Genre}
            </Nowrap>
            {!record.trackTime ? (
              <Box />
            ) : (
              <Nowrap variant="body2">
                {moment.utc(record.trackTime).format("mm:ss")}
              </Nowrap>
            )}
            <Nowrap
              onClick={() =>
                listman.send({
                  type: "open",
                  track: record,
                })
              }
            >
              {listman.contains(record) ? (
                <Favorite color="error" />
              ) : (
                <FavoriteBorder />
              )}
            </Nowrap>

            <Box
              onClick={() =>
                tracker.send({
                  type: "open",
                  track: record,
                })
              }
            >
              <MoreVert />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
