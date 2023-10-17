import {
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { ArrowBack } from "@mui/icons-material";
import Spacer from "../../../styled/Spacer";
import { ADD_ALBUM, ADD_ARTIST } from "../../../machines/curatorMachine";
import { Picture } from "../../../hooks/useImage";
import Nowrap from "../../../styled/Nowrap";

export default function CuratorCollapse({ curator }) {
  const { add_pref } = curator.state.context;
  const handleCheckboxChange = (bit) => {
    curator.send({
      type: "changepref",
      bit,
    });
  };
  return (
    <>
      <Collapse in={curator.state.can("okay")}>
        <Stack sx={{ m: 1 }} spacing={1}>
          <Flex spacing={1}>
            <IconButton onClick={() => curator.send("retry")}>
              <ArrowBack />
            </IconButton>
            <Spacer />
            <Typography variant="caption">Add</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={add_pref & ADD_ARTIST}
                  onChange={() => handleCheckboxChange(ADD_ARTIST)}
                  name="enabled"
                  color="primary"
                />
              }
              label="Artists"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={add_pref & ADD_ALBUM}
                  onChange={() => handleCheckboxChange(ADD_ALBUM)}
                  name="enabled"
                  color="primary"
                />
              }
              label="Albums"
            />
          </Flex>
          {curator.state.context.matches?.length || "No"} items found.
          {!!curator.state.context.matches && (
            <>
              {curator.state.context.matches.map((item) => (
                <Flex
                  onClick={() =>
                    curator.send({
                      type: "okay",
                      answer: item,
                    })
                  }
                  spacing={1}
                >
                  <Picture
                    src={item.albumImage}
                    alt={item.Title}
                    style={{
                      width: 64,
                      height: 64,
                    }}
                  />
                  <Stack>
                    <Flex>{item.Title}</Flex>
                    {!!(add_pref & ADD_ARTIST) && (
                      <Nowrap variant="caption">{item.artistName}</Nowrap>
                    )}
                    {!!(add_pref & ADD_ALBUM) && (
                      <Nowrap variant="caption">{item.albumName}</Nowrap>
                    )}
                  </Stack>
                </Flex>
              ))}
            </>
          )}
        </Stack>
      </Collapse>

      <Collapse in={curator.state.can("accept")}>
        <Stack>
          <Flex spacing={1} baseline>
            <Picture
              src={curator.state.context.track.albumImage}
              style={{ width: 100, height: 100 }}
              alt={curator.state.context.track.Title}
            />
            <Stack sx={{ width: 300 }}>
              {Object.keys(curator.state.context.track).map((key) => (
                <Flex between key={key}>
                  <Nowrap variant="subtitle2">{key}</Nowrap>
                  <Nowrap variant="caption">
                    {curator.state.context.track[key]}
                  </Nowrap>
                </Flex>
              ))}
            </Stack>
          </Flex>
          <Flex>
            <Button onClick={() => curator.send("retry")}>retry</Button>
            <Spacer />
            <Button onClick={() => curator.send("cancel")}>cancel</Button>
            <Button onClick={() => curator.send("accept")}>accept</Button>
          </Flex>
        </Stack>
      </Collapse>
      <Collapse in={curator.state.can("search")}>
        <Stack sx={{ m: 1 }} spacing={1}>
          <TextField
            size="small"
            value={curator.state.context.param}
            label="Search for"
            onChange={(e) => {
              curator.send({
                type: "change",
                name: "param",
                value: e.target.value,
              });
            }}
          />
          <Flex spacing={1}>
            <Spacer />
            <Button size="small" onClick={() => curator.send("close")}>
              cancel
            </Button>
            <Button
              size="small"
              onClick={() => curator.send("search")}
              variant="contained"
            >
              search
            </Button>
          </Flex>
        </Stack>
      </Collapse>
    </>
  );
}
