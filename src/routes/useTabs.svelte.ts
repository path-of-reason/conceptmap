import { untrack } from "svelte";
import { createSwapy, utils, type SlotItemMapArray } from "swapy";

export type TabItem = {
  slotId: string;
  title: string;
  active: boolean;
};
const initialTabs: TabItem[] = [
  { slotId: "1", title: "filename1", active: false },
];
export let tabItems = $state(initialTabs);
let nextSlotId = 2;
let slotItemMap = $state(utils.initSlotItemMap(initialTabs, "slotId"));
export const slottedItems = $derived(
  utils.toSlottedItems(tabItems, "slotId", slotItemMap),
);

const setSlotItemMap = (value: SlotItemMapArray) => (slotItemMap = value);
export const useSwapy = (container: HTMLElement) => {
  let swapy = createSwapy(container, {
    // dragAxis: 'x',
    manualSwap: true,
    // animation: 'dynamic'
    // autoScrollOnDrag: true,
    // swapMode: 'drop',
    // enabled: true,
    // dragOnHold: true
  });

  swapy.onSwapStart((event) => {
    // tabItems = tabItems.map((item) => ({...item, active: item.title === event.draggingItem ? true : false}))
  });

  swapy.onSwap((event) => {
    requestAnimationFrame(() => {
      slotItemMap = event.newSlotItemMap.asArray;
    });
  });

  swapy.onSwapEnd((event) => {
    // console.log('end', event)
    // console.log("original data", items)
  });

  $effect(() => {
    utils.dynamicSwapy(
      swapy,
      tabItems,
      "slotId",
      untrack(() => slotItemMap),
      setSlotItemMap,
    );

    return () => {
      swapy.destroy();
    };
  });
};

export const newTab = () => {
  const newItem = {
    slotId: `${nextSlotId}`,
    title: `filename${nextSlotId}`,
    active: false,
  };
  tabItems.push(newItem);
  nextSlotId++;
};
export const removeTab = (item: TabItem) => () => {
  tabItems = tabItems.filter((i) => i.slotId !== item.slotId);
};
