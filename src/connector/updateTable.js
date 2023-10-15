import { API_ENDPOINT } from "../constants";

export const updateTable = async (table = "s3Music", json = {}) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
  const response = await fetch(
    `${API_ENDPOINT}/update/${table}`,
    requestOptions
  );
  return await response.json();
};
