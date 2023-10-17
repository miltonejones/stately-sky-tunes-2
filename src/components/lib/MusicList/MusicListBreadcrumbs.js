import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { GRID_QUERY_PROPS, queryTypeIcons } from "../../../constants";
import { Home, NavigateNext } from "@mui/icons-material";
import Nowrap from "../../../styled/Nowrap";

export default function MusicListBreadcrumbs({ isMobile, send, state }) {
  const { type } = state.context.queryProps;
  const { detail } = state.context;
  const props = GRID_QUERY_PROPS[type];
  const Second = !!detail ? Link : Typography;
  const label = type === "music" ? "Library" : `${type}s`;
  return (
    <Box>
      {/* {JSON.stringify(state.context.queryProps)} */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
        <Link
          variant="body2"
          underline="hover"
          color="inherit"
          onClick={() => {
            send("home");
          }}
        >
          {isMobile ? <Home /> : "Home"}
        </Link>{" "}
        <Second
          variant={!detail ? "subtitle2" : "body2"}
          sx={{ textTransform: "capitalize", cursor: "pointer" }}
          underline="hover"
          color="inherit"
          onClick={() =>
            send({
              type: "open",
              queryProps: {
                ...state.context.queryProps,
                ...GRID_QUERY_PROPS[type],
                type,
                page: 1,
              },
            })
          }
        >
          {isMobile && queryTypeIcons[type] ? queryTypeIcons[type] : label}
        </Second>
        {!!detail && (
          <Nowrap variant="caption" bold>
            {detail[props?.field]}
          </Nowrap>
        )}
      </Breadcrumbs>
      {/* [ {JSON.stringify(props)}] [ {JSON.stringify(detail)}] */}
    </Box>
  );
}
