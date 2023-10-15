// import React from 'react';
import { styled, Card } from "@mui/material";

const Panel = styled(Card)(({ theme, offset }) => ({
  padding: theme.spacing(1),
  height: `calc(100vh - ${offset}px)`,
  overflow: "auto",
}));

export default Panel;
