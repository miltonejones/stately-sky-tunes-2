import { Box } from "@mui/material";
import DashCard from "../DashCard/DashCard";
import { LIST_IDENTIFIER } from "../../../constants";

export default function MusicGrid({
  openList,
  isMobile,
  rotated,
  records,
  state,
}) {
  const { type } = state.context.queryProps;
  let gridTemplateColumns = isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr 1fr";
  if (rotated) {
    gridTemplateColumns = "1fr 1fr 1fr 1fr";
  }
  return (
    <Box
      sx={{ p: 2, display: "grid", gridTemplateColumns: gridTemplateColumns }}
    >
      {records?.map((item) => (
        <DashCard
          onClick={() => {
            openList(type, item[LIST_IDENTIFIER[type]]);
          }}
          key={item[LIST_IDENTIFIER[type]]}
          item={item}
        />
      ))}
    </Box>
  );
}
