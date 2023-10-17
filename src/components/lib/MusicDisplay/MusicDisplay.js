import { Avatar, Chip, IconButton, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import MusicGrid from "../MusicGrid/MusicGrid";
import MusicList from "../MusicList/MusicList";
import MusicListBreadcrumbs from "../MusicList/MusicListBreadcrumbs";
import Spacer from "../../../styled/Spacer";
import { ArrowBack, ArrowForward, SortByAlpha } from "@mui/icons-material";
import MusicPagination from "./MusicPagination";
import NavChips from "./NavChips";
import { LOGO_PHOTO } from "../../../constants";
import SortMenu from "../NavigationPanel/SortMenu";
import SettingsModal from "../SettingsModal/SettingsModal";

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
  const { queryProps, selectedID } = props.state.context;
  const { field, type, direction } = queryProps;
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
            src={LOGO_PHOTO}
            alt="logo"
          />
          <SettingsModal
            player={props.player}
            onClick={() => props.setState("debug", !props.state.context.debug)}
          />
        </Flex>
      )}
      <MusicPagination {...props} queryProps={props.state.context.queryProps} />
      {!!props.isMobile && (
        <Flex sx={{ pb: 1, pt: 1 }} spacing={1}>
          <Spacer />
          <NavChips {...props} />
          {!!field && !selectedID && (
            <SortMenu
              send={props.send}
              field={field}
              type={type}
              musicProps={queryProps}
              direction={direction}
              component={Chip}
              size="small"
              variant="filled"
              color="primary"
              icon={<SortByAlpha />}
            />
          )}
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
