import { API_ENDPOINT } from "../constants";

export const getDashboard = async () => {
  const response = await fetch(API_ENDPOINT + `/dash`);
  return await response.json();
};
