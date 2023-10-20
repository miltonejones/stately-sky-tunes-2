export default async function getLyrics(song, artist) {
  let endpoint =
    "https://sridurgayadav-chart-lyrics-v1.p.rapidapi.com/apiv1.asmx/SearchLyricDirect";
  const requestOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "46cf185cf2msh588fea66a021323p1a6f61jsnc8694b953c98",
      "X-RapidAPI-Host": "sridurgayadav-chart-lyrics-v1.p.rapidapi.com",
    },
    // body: JSON.stringify({ artist, song }),
  };

  const response = await fetch(
    `${endpoint}?artist=${artist}&song=${song}`,
    requestOptions
  );
  return await response.json();
}
