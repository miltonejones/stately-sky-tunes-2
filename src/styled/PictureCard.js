import { Card, Stack, Typography } from "@mui/material";
import Flex from "./Flex";
import { Picture } from "../hooks/useImage";
import Nowrap from "./Nowrap";

export default function PictureCard({ active, src, title, caption, onClick }) {
  return (
    <Card
      sx={{
        backgroundColor: (theme) =>
          active ? theme.palette.grey[200] : theme.palette.common.white,
      }}
      onClick={onClick}
    >
      <Flex sx={{ alignItems: "flex-start" }} spacing={1}>
        <Picture
          src={src}
          alt={title}
          style={{
            width: 56,
            height: 56,
          }}
        />
        <Stack sx={{ m: 1 }}>
          <Nowrap variant="body2">{title}</Nowrap>
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        </Stack>
      </Flex>
    </Card>
  );
}
