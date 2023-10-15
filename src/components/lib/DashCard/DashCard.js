import { Card, CardContent, CardMedia } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import { useImage } from "../../../hooks/useImage";

export default function DashCard({ item, ...props }) {
  const { source } = useImage(item.Thumbnail || item.image || item.albumImage);
  return (
    <Card {...props} sx={{ m: 1, p: 1, overflow: "hidden" }}>
      <CardMedia component="img" image={source} alt={item.Name} />
      <CardContent>
        <Nowrap variant="body2" color="text.secondary">
          {item.Name || item.Title || item.Genre}
        </Nowrap>
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
