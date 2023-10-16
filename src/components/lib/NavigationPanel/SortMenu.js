import { CheckCircle, SortByAlpha } from "@mui/icons-material";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { SORT_FIELDS } from "../../../constants";
import { useMenu } from "../../../machines/menuMachine";

export default function SortMenu({
  type,
  field,
  send,
  musicProps,
  direction,
  component: Component = Button,
  ...props
}) {
  const sortProps = SORT_FIELDS[type];
  const menu = useMenu((value) => {
    if (!value) return;
    send({
      type: "open",
      queryProps: {
        ...musicProps,
        field: value,
        direction: direction === "ASC" ? "DESC" : "ASC",
        page: 1,
      },
    });
  });
  if (!sortProps) return <i />;
  const label = Object.keys(sortProps).find((f) => sortProps[f] === field);
  return (
    <>
      <Component
        onClick={menu.handleClick}
        label={label}
        sx={{ textTransform: "capitalize" }}
        endIcon={<SortByAlpha />}
        {...props}
      >
        {label}
      </Component>
      {!!sortProps && (
        <Menu {...menu.menuProps}>
          <Divider textAlign="left">sort by</Divider>
          {Object.keys(sortProps).map((key) => (
            <MenuItem onClick={menu.handleClose(sortProps[key])}>
              {sortProps[key] === field && <CheckCircle />}
              {key}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
