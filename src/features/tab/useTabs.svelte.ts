import { untrack } from "svelte";
import { createSwapy, utils, type SlotItemMapArray } from "swapy";

export type TabItem = {
  slotId: string;
  title: string;
  active: boolean;
  path: string;
};
const initialTabs: TabItem[] = [];

let store = $state({
  tabItems: initialTabs,
  currentId: null as string | null,
  slotItemMap: utils.initSlotItemMap(initialTabs, "slotId"),
  generateId: initialTabs.length + 1,
});

export const useTabs = () => {
  const useSwapy = (container: HTMLElement) => {
    let swapy = createSwapy(container, {
      manualSwap: true,
    });
    swapy.onSwapStart((event) => changeActiveTab(event.draggingItem));
    swapy.onSwap((event) =>
      requestAnimationFrame(() => setSlotItemMap(event.newSlotItemMap.asArray)),
    );
    swapy.onSwapEnd((event) => {});

    $effect(() => {
      utils.dynamicSwapy(
        swapy,
        store.tabItems,
        "slotId",
        untrack(() => store.slotItemMap),
        setSlotItemMap,
      );
    });

    $effect(() => {
      return () => {
        swapy?.destroy();
      };
    });
  };
  const newTab = () => {
    const newItem = {
      slotId: `${store.generateId}`,
      title: `filename ${store.generateId}`,
      path: "test/path.md",
      active: true,
    };
    store.tabItems = [
      ...store.tabItems.map((item) => ({ ...item, active: false })),
      newItem,
    ];
    store.currentId = newItem.slotId;
    store.generateId++;
  };
  const removeTab = (item: TabItem) => () => {
    const filteredItems = store.tabItems.filter(
      (i) => i.slotId !== item.slotId,
    );
    if (!item.active) {
      store.tabItems = filteredItems;
    } else if (filteredItems.length === 0) {
      store.tabItems = filteredItems;
      store.currentId = null;
    } else {
      const lastItem = store.tabItems.findLast((i) => i.slotId !== item.slotId);
      if (lastItem) {
        store.tabItems = filteredItems.map((i) => ({
          ...i,
          active: i.slotId === lastItem.slotId ? true : false,
        }));
        store.currentId = lastItem.slotId;
      }
    }
  };
  const move = (from: number, to: number) => {
    const arr = [...store.tabItems];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    store.tabItems = arr;
  };
  return {
    tabStore: store,
    useSwapy,
    newTab,
    removeTab,
    move,
  };
};

const setSlotItemMap = (value: SlotItemMapArray) => (store.slotItemMap = value);
const changeActiveTab = (slotId: string) => {
  store.tabItems = store.tabItems.map((item) => ({
    ...item,
    active: item.slotId === slotId ? true : false,
  }));
  store.currentId = slotId;
};

export const useNewTab = (el: HTMLElement) => {};
