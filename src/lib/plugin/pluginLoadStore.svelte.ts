export let load = $state({
  leftSidebar: false,
});

export const loadLeftSidebar = () => {
  load.leftSidebar = true;
};
