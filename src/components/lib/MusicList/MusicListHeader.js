import { Box, Typography } from "@mui/material";

export default function MusicListHeader({ artist, type }) {
  if (!artist?.imageLg) return <i />;
  return (
    <>
      <Box
        sx={{
          width: "calc(75vw - 64px)",
          height: "35vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={artist.imageLg}
          alt={artist.Name}
          style={{
            width: "100%",
            position: "absolute",
            top: "-50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            left: 40,
            color: "white",
            mixBlendMode: "difference",
          }}
        >
          <Typography
            sx={{ lineHeight: 1, textTransform: "capitalize" }}
            variant="subtitle2"
          >
            {type}
          </Typography>
          <Typography sx={{ lineHeight: 1 }} variant="h3">
            {artist.Name}
          </Typography>
          <Typography sx={{ lineHeight: 1 }} variant="h6">
            {artist.TrackCount} tracks in your library
          </Typography>
        </Box>
        {/* {JSON.stringify(artist)} */}
      </Box>
    </>
  );
}
