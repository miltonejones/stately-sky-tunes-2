import { API_ENDPOINT } from "../constants";

export const findMusic = async ({ page = 1, type = "music", param }) => {
  const response = await fetch(
    API_ENDPOINT + `/search/${page}/${type}/${param}`
  );
  return await response.json();
};
