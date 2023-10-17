export const getLocalSettings = () => {
  return JSON.parse(localStorage.getItem("sky-settings") || "{}");
};
