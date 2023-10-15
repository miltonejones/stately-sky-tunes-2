export const stripTrack = (track) => {
  const {
    Genre,
    Title,
    albumFk,
    artistFk,
    discNumber,
    trackNumber,
    ID,
    albumImage,
    trackTime,
  } = track;
  return {
    Genre,
    Title,
    albumFk,
    artistFk,
    discNumber,
    trackNumber,
    ID,
    trackTime,
    albumImage,
  };
};
