import { API_ENDPOINT } from "../constants";

export const getMusicList = async (
  { field = "ID", direction = "DESC", page = 1, type = "music" },
  ID
) => {
  let endpoint =
    API_ENDPOINT + `/request/${field}/${direction}/${page}/${type}`;
  if (ID) endpoint += `/${ID}`;
  const response = await fetch(endpoint);
  return await response.json();
};
