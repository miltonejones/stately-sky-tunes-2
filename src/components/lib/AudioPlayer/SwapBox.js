import React from "react";
import { useImageSwap } from "../../../machines/imageswapMachine";
import { Box } from "@mui/material";
import { Picture } from "../../../hooks/useImage";

export default function SwapBox({ image, title }) {
  const swap = useImageSwap();
  const swapping = swap.state.matches("swapping");
  const idleClassName = swapping
    ? "photo-swappable image-swap swapping"
    : "photo-swappable image-idle";
  const swapClassName = swapping
    ? "photo-swappable image-idle swapping"
    : "photo-swappable image-ready";

  React.useEffect(() => {
    const type = swap.state.can("swap") ? "swap" : "init";
    swap.send({
      type,
      pic: image,
    });
  }, [image]);
  return (
    <>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: 64,
          height: 64,
        }}
      >
        {!!swap.mainPic && (
          <Picture src={swap.mainPic} alt={title} className={idleClassName} />
        )}

        {!!swap.swapPic && !swap.state.can("swap") && (
          <Picture src={swap.swapPic} alt={title} className={swapClassName} />
        )}
      </Box>
    </>
  );
}
