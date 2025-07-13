export const hiderStore = () => {
  let hider = $state({
    tabbar: true,
    leftSidebar: false,
  });

  const toggleTabbar = () => (hider.tabbar = !hider.tabbar);
  const toggleLeftSidebar = () => (hider.leftSidebar = !hider.leftSidebar);

  return {
    tabbar: hider.tabbar,
    leftSidebar: hider.leftSidebar,
    toggleTabbar,
    toggleLeftSidebar,
  };
};
