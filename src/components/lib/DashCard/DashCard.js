import { Box, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import { useImage } from "../../../hooks/useImage";
import { PlayCircle } from "@mui/icons-material";

export default function DashCard({ item, onClick, onPlay, ...props }) {
  const { source } = useImage(item.Thumbnail || item.image || item.albumImage);
  return (
    <Card {...props} sx={{ m: 1, p: 1, overflow: "hidden" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          onClick={onClick}
          component="img"
          image={source}
          alt={item.Name}
        />
        {!!onPlay && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
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
      <CardContent onClick={onClick}>
        <Nowrap variant="body2" color="text.secondary">
          {item.Name || item.Title || item.Genre}
        </Nowrap>
        {!!item.Caption && (
          <Nowrap variant="caption" color="text.secondary">
            {item.Caption}
          </Nowrap>
        )}
        {!!item.TrackCount && (
          <Nowrap variant="caption" color="text.secondary">
            {item.TrackCount} tracks
          </Nowrap>
        )}
        {!!item.artistName && (
          <Nowrap variant="caption" color="text.secondary">
            {item.artistName}
          </Nowrap>
        )}
      </CardContent>
    </Card>
  );
}
