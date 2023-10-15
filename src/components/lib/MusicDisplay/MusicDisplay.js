import { Avatar, IconButton, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import MusicGrid from "../MusicGrid/MusicGrid";
import MusicList from "../MusicList/MusicList";
import MusicListBreadcrumbs from "../MusicList/MusicListBreadcrumbs";
import Spacer from "../../../styled/Spacer";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import MusicPagination from "./MusicPagination";
import NavChips from "./NavChips";

export const MemoryButtons = ({ state, send }) => {
  const { memory_index, memory } = state.context;
  return (
    <>
      <Flex>
        <IconButton
          disabled={memory_index < 1}
          onClick={() =>
            send({
              type: "navigate",
              offset: -1,
            })
          }
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          disabled={!(memory_index < memory.length - 1)}
          onClick={() =>
            send({
              type: "navigate",
              offset: 1,
            })
          }
        >
          <ArrowForward />
        </IconButton>
      </Flex>
    </>
  );
};

export default function MusicDisplay(props) {
  return (
    <>
      {" "}
      {!props.rotated && (
        <Flex spacing={1} sx={{ p: 2 }}>
          <MemoryButtons {...props} />

          <MusicListBreadcrumbs {...props} />
          <Spacer />
          {!props.isMobile && <Typography variant="h6">SkyTunes</Typography>}
          <Avatar
            onClick={() => props.setState("debug", !props.state.context.debug)}
            src="https://www.sky-tunes.com/assets/icon-72x72.png"
            alt="logo"
          />
        </Flex>
      )}
      <MusicPagination {...props} queryProps={props.state.context.queryProps} />
      {!!props.isMobile && (
        <Flex sx={{ pb: 1, pt: 1 }} spacing={1}>
          <Spacer />
          <NavChips {...props} />
        </Flex>
      )}
      {props.state.matches("display music list.display list view") && (
        <MusicList {...props} />
      )}
      {props.state.matches("display music list.display grid view") && (
        <MusicGrid {...props} />
      )}
    </>
  );
}
