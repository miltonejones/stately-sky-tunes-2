export const musicServices = {
  loadListList: async (context) => {
    return getMusicList(context.queryProps, context.selectedID);
  },
  searchMusic: async (context) => {
    return findMusic({
      page: 1,
      param: context.searchParam,
      type: searches[context.search_index],
    });
  },
  loadDashboard: async (context) => {
    return getDashboard();
  },
};
