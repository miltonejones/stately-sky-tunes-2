import { getLocalSettings } from "./getLocalSettings";

export const setLocalSettings = (key, value) => {
  const settings = getLocalSettings();
  localStorage.setItem(
    "sky-settings",
    JSON.stringify({
      ...settings,
      [key]: value,
    })
  );
};
