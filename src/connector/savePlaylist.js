import { API_ENDPOINT } from "../constants";

export const savePlaylist = async (json) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
  const response = await fetch(`${API_ENDPOINT}/playlist`, requestOptions);
  return await response.json();
};
