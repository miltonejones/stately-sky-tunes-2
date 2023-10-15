import { Pagination, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";

export default function MusicPagination({
  state,
  send,
  count,
  queryProps,
  selectedID,
  label,
}) {
  const handleChange = (_, num) => {
    send({
      type: "open",
      selectedID,
      queryProps: {
        ...queryProps,
        page: num,
      },
    });
  };
  return (
    <>
      {!!count && count > 100 && (
        <Flex spacing={1}>
          <Pagination
            count={Math.ceil(count / 100)}
            page={state.context.queryProps.page}
            onChange={handleChange}
          />
          {!!label && <Typography variant="caption">{count} items</Typography>}
        </Flex>
      )}
    </>
  );
}
