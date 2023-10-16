function customSort(arr) {
  // Find the index of the string "Liked Songs" in the array
  const likedSongsIndex = arr.indexOf("Liked Songs");

  // If "Liked Songs" is present in the array
  if (likedSongsIndex !== -1) {
    // Remove "Liked Songs" from its current position
    const likedSongs = arr.splice(likedSongsIndex, 1);
    // Insert "Liked Songs" at the beginning of the array
    arr.unshift(likedSongs[0]);
  }

  // Sort the remaining strings alphabetically
  arr.slice(1).sort();

  return arr;
}
export default function playlistSort(records) {
  if (!records) return [];
  return customSort(records.map((f) => f.Title)).map((title) =>
    records.find((f) => f.Title === title)
  );
}
