export type TabItem = {
  id: string;
  title: string;
  location: "main" | "sidebar";
};

let tabs = $state<TabItem[]>([]);
let activeTabId = $state<string>("none");

export function useLayout() {
  return {
    get tabs() {
      return tabs;
    },
    get activeTabId() {
      return activeTabId;
    },
    openTab(
      item: Omit<TabItem, "location">,
      location: "main" | "sidebar" = "main",
    ) {
      const existing = tabs.find((t) => t.id === item.id);
      if (existing) {
        activeTabId = existing.id;
      } else {
        const newTab = { ...item, location };
        tabs.push(newTab);
        activeTabId = newTab.id;
      }
    },
    closeTab(id: string) {
      const index = tabs.findIndex((t) => t.id === id);
      if (index === -1) return;

      tabs.splice(index, 1);

      if (activeTabId === id) {
        if (tabs.length > 0) {
          activeTabId = tabs[Math.max(0, index - 1)].id;
        } else {
          activeTabId = "none";
        }
      }
    },
    setActiveTab(id: string) {
      activeTabId = id;
    },
  };
}
