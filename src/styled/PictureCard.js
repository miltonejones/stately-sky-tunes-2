import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import Flex from "./Flex";
import { Picture } from "../hooks/useImage";
import Nowrap from "./Nowrap";
import { PlayCircle } from "@mui/icons-material";

export default function PictureCard({
  active,
  src,
  title,
  caption,
  onClick,
  onPlay,
  bold,
}) {
  return (
    <Card
      sx={{
        backgroundColor: (theme) =>
          active ? theme.palette.grey[200] : theme.palette.common.white,
      }}
    >
      <Flex sx={{ alignItems: "flex-start" }} spacing={1}>
        <Box sx={{ position: "relative" }}>
          <Picture
            src={src}
            alt={title}
            style={{
              width: 56,
              height: 56,
            }}
          />
          {!!onPlay && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.2,
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <IconButton onClick={onPlay}>
                <PlayCircle />
              </IconButton>
            </Box>
          )}
        </Box>
        <Stack onClick={onClick} sx={{ m: 1 }}>
          <Nowrap bold={bold} variant="body2">
            {title}
          </Nowrap>
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        </Stack>
      </Flex>
    </Card>
  );
}
