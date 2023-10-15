import { API_ENDPOINT } from "../constants";

export const getAlbumorArtistId = async (type, name, image) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, name, image }),
  };
  const response = await fetch(`${API_ENDPOINT}/find`, requestOptions);
  return await response.json();
};
