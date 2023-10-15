import { stripTrack } from "../util/stripTrack";
import { updateTable } from "./updateTable";

export const saveTrack = async (track) => {
  return await updateTable("s3Music", stripTrack({ ...track }));
};
