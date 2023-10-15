import React from "react";

export const useImage = (src) => {
  const [source, setSource] = React.useState(
    "https://www.sky-tunes.com/assets/default_album_cover.jpg"
  );

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
