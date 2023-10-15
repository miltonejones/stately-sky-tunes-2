import { Chip, Collapse } from "@mui/material";
import { GRID_QUERY_PROPS } from "../../../constants";
import { Album, Checklist, LocalOffer, Person } from "@mui/icons-material";

export default function NavChips({ state, send }) {
  const queryTypes = {
    album: <Album />,
    artist: <Person />,
    genre: <LocalOffer />,
    playlist: <Checklist />,
  };
  const types = Object.keys(queryTypes);
  const onLibrary =
    !state.context.queryProps.type || state.context.queryProps.type === "music";
  return (
    <>
      {types.map((key, i) => (
        <Collapse
          key={i}
          orientation="horizontal"
          in={
            !state.context.queryProps.type ||
            state.context.queryProps.type === key ||
            onLibrary
          }
        >
          <Chip
            icon={queryTypes[key]}
            sx={{ textTransform: "capitalize" }}
            onDelete={
              !state.context.queryProps.type || onLibrary
                ? null
                : () => send("library")
            }
            onClick={() => {
              send({
                type: "open",
                queryProps: {
                  ...state.context.queryProps,
                  ...GRID_QUERY_PROPS[key],
                  type: key,
                  page: 1,
                },
              });
            }}
            size="small"
            variant={
              state.context.queryProps.type === key ? "filled" : "outlined"
            }
            color="primary"
            label={`${key}s`}
            key={key}
          />
        </Collapse>
      ))}
    </>
  );
}
