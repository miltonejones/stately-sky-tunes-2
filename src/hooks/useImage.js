import React from "react";
import { COVER_ART_IMAGE } from "../constants";

export const useImage = (src) => {
  const [source, setSource] = React.useState(COVER_ART_IMAGE);

  React.useEffect(() => {
    const im = new Image();
    im.onload = () => {
      if (im.height > im.width) return;
      setSource(src);
    };
    im.src = src;
  }, [src]);

  return {
    source,
  };
};

export const Picture = ({ src, alt, ...props }) => {
  const { source } = useImage(src);
  return <img src={source} alt={alt} {...props} />;
};
