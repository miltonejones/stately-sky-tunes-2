import { getLocalSettings } from "./getLocalSettings";

export const getLocalSetting = (key) => {
  const settings = getLocalSettings();
  return settings[key];
};
