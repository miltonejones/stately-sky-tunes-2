import React from "react";
import { Box, Typography } from "@mui/material";
import { useImageSwap } from "../../../machines/imageswapMachine";

export default function MusicListHeader({ artist, type }) {
  const swap = useImageSwap();
  React.useEffect(() => {
    const type = swap.state.can("swap") ? "swap" : "init";
    swap.send({
      type,
      pic: artist.imageLg,
    });
  }, [artist.imageLg]);

  if (!artist?.imageLg) return <i />;
  const swapping = swap.state.matches("swapping");
  const idleClassName = swapping
    ? "image-swappable image-swap swapping"
    : "image-swappable image-idle";
  const swapClassName = swapping
    ? "image-swappable image-idle swapping"
    : "image-swappable image-ready";

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
        {!!swap.mainPic && (
          <img src={swap.mainPic} alt={artist.Name} className={idleClassName} />
        )}

        {!!swap.swapPic && (
          <img src={swap.swapPic} alt={artist.Name} className={swapClassName} />
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            left: 40,
            color: "white",
            mixBlendMode: "difference",
          }}
        >
          <Typography sx={{ lineHeight: 1 }}></Typography>
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
