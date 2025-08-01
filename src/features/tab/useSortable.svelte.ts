export type TabItem = {
  id: string;
  title: string;
  active: boolean;
  path: string;
};

const initialTabs: TabItem[] = [];
let store = $state({
  tabItems: initialTabs,
  currentId: null as string | null,
  generateId: initialTabs.length + 1,
});

export const useTabs = () => {
  /* ---------- SortableJS 연결용 ---------- */
  const useSortable = (container: HTMLElement) => {
    // new Sortable(container, {
    //   group: "tabs",
    //   animation: 200,
    //   ghostClass: "tab-ghost",
    //   chosenClass: "tab-chosen",
    //   dragClass: "tab-drag",
    //   // ghostClass: "tab-ghost opacity-30",
    //   // chosenClass: "ring-2 ring-offset-2 ring-blue-500",
    //   // dragClass: "cursor-grabbing",
    //   onEnd: (evt) => {
    //     if (evt.oldIndex === undefined || evt.newIndex === undefined) return;
    //     move(evt.oldIndex, evt.newIndex);
    //   },
    // });
  };

  /* ---------- CRUD ---------- */
  const newTab = () => {
    const newItem: TabItem = {
      id: `tab-${store.generateId}`,
      title: `filename ${store.generateId}`,
      path: "test/path.md",
      active: true,
    };
    store.tabItems = [
      ...store.tabItems.map((t) => ({ ...t, active: false })),
      newItem,
    ];
    store.currentId = newItem.id;
    store.generateId += 1;
  };

  const removeTab = (item: TabItem) => (e: MouseEvent) => {
    e.stopPropagation();
    const filtered = store.tabItems.filter((t) => t.id !== item.id);
    if (!item.active) {
      store.tabItems = filtered;
      return;
    }
    if (filtered.length === 0) {
      store.tabItems = [];
      store.currentId = null;
      return;
    }

    // 닫힌 탭이 활성 탭이면, 마지막 탭을 활성화
    const last = filtered.at(-1)!;
    store.tabItems = filtered.map((t) =>
      t.id === last.id ? { ...t, active: true } : t,
    );
    store.currentId = last.id;
  };

  const move = (from: number, to: number) => {
    const arr = [...store.tabItems];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    store.tabItems = arr;
  };

  const setActive = (id: string) => () => {
    store.tabItems = store.tabItems.map((t) =>
      t.id === id ? { ...t, active: true } : { ...t, active: false },
    );
    store.currentId = id;
  };

  return {
    tabStore: store,
    useSortable,
    newTab,
    removeTab,
    move,
    setActive,
  };
};
