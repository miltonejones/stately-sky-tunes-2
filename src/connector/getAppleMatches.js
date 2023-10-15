import { API_ENDPOINT } from "../constants";
import AppleConvert from "../util/AppleConvert";

export const getAppleMatches = async (title) => {
  const address = `${API_ENDPOINT}/apple/${title}`;
  const response = await fetch(address);
  const json = await response.json();
  if (json.results?.length) {
    return json?.results?.map(AppleConvert);
  }
};
