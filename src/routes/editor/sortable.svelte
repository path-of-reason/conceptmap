<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Sortable from 'sortablejs'; // SortableJS 임포트
  import * as Tabs from '$lib/components/ui/tabs/index.js'; // Shadcn Tabs 임포트 경로 확인
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import XIcon from "@lucide/svelte/icons/x";
  import PlusIcon from "@lucide/svelte/icons/plus";

  // 탭 아이템 타입 정의
  type TabItem = {
    id: string; // SortableJS와 Tabs.Root의 value에 사용할 고유 ID
    title: string;
  };

  // 부모 컴포넌트로부터 받을 Props 정의
  // children (기본 슬롯 콘텐츠)과 namedSlots (명명된 슬롯)을 포함
  let { children }  = $props();

  const initialTabList = [
    { id: '1', title: 'Tab 1' },
    { id: '2', title: 'Tab 2' },
    { id: '3', title: 'Tab 3' },
  ];
  let activeTabValue = $state(initialTabList[0]?.id || '');
  // 탭 목록 데이터를 $state로 관리 (내부적으로 순서가 변경됩니다)
  let tabItems = $state<TabItem[]>(initialTabList);
  // 현재 활성화된 탭의 ID를 관리 (props로 받은 activeTabValue를 초기값으로 사용)
  let currentActiveTab = $derived(activeTabValue || tabItems[0]?.id || '');
  // 새 탭 생성을 위한 ID 카운터
  let nextTabId = $derived(
    tabItems.length > 0 ? Math.max(...tabItems.map((t) => parseInt(t.id))) + 1 : 1,
  );

  // SortableJS 인스턴스와 컨테이너 참조
  let sortableContainer: HTMLElement;
  let sortableInstance: Sortable | null = null;

  // 새 탭 추가 함수
  const newTab = () => {
    const newId = `${nextTabId}`;
    const newItem: TabItem = {
      id: newId,
      title: `File ${newId}`,
    };
    tabItems.push(newItem); // $state 배열에 직접 push하여 반응성 트리거
    nextTabId++;
    currentActiveTab = newId; // 새 탭 추가 시 바로 활성화
  };

  // 탭 제거 함수
  const removeTab = (itemToRemove: TabItem) => () => {
    tabItems = tabItems.filter((item) => item.id !== itemToRemove.id);
    // 현재 활성 탭이 삭제된 탭이라면, 다른 탭으로 활성 전환
    if (currentActiveTab === itemToRemove.id) {
      currentActiveTab = tabItems[0]?.id || ''; // 첫 번째 탭으로 또는 비어있으면 빈 문자열
    }
  };

  onMount(() => {
    if (sortableContainer) {
      sortableInstance = new Sortable(sortableContainer, {
        animation: 150,
        handle: '.drag-handle', // 드래그 핸들 (선택 사항, 없으면 탭 전체가 드래그 가능)
        forceFallback: true, // 터치 디바이스에서 드래그 동작 강제 (선택 사항)
        easing: 'cubic-bezier(1, 0, 0, 1)', // 애니메이션 이징

        // 아이템의 데이터 ID를 SortableJS에 알림 (선택 사항이지만 유용)
        // dataIdAttr: 'data-id',

        // --- SortableJS 이벤트 핸들러 ---
        onUpdate: (event) => {
          // DOM 순서가 이미 변경된 후 발생
          const { oldIndex, newIndex } = event;

          if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
            return;
          }

          // $state 배열의 순서를 DOM과 동기화
          // Svelte의 반응성을 제대로 트리거하기 위해 새로운 배열을 생성합니다.
          const newTabItems = [...tabItems];
          const [movedItem] = newTabItems.splice(oldIndex, 1); // 기존 위치에서 제거
          newTabItems.splice(newIndex, 0, movedItem); // 새 위치에 삽입
          tabItems = newTabItems; // $state 변수 업데이트
        },
        onStart: (event) => {
          // 드래그 시작 시 호출 (필요한 경우 로직 추가)
        },
        onEnd: (event) => {
          // 드래그 종료 시 호출 (필요한 경우 로직 추가)
        },
      });
    }
  });

  onDestroy(() => {
    sortableInstance?.destroy(); // 컴포넌트 파괴 시 SortableJS 인스턴스 정리
  });
</script>

<Tabs.Root bind:value={currentActiveTab} class="w-full h-full flex flex-col gap-0">
  <div class="flex-none flex justify-between items-center bg-zinc-700/50 rounded-lg p-1 gap-1">
    <div class="flex flex-1 overflow-x-auto scrollbar-hide" bind:this={sortableContainer}>
      {#each tabItems as tab (tab.id)}
        <div data-id={tab.id} class="group relative flex-none">
          <Tabs.Trigger
            value={tab.id}
            class={cn(
              "data-[state=active]:bg-white/50 data-[state=active]:text-black/60 transition-colors",
              "dark:data-[state=active]:text-foreground bg-black/10 text-white/30",
              "relative w-fit h-8 flex items-center justify-center px-4 py-2 rounded-md text-sm",
              "hover:bg-black/20 dark:hover:bg-zinc-600/70", // 호버 스타일 추가
              "pl-7" // 삭제 버튼 공간 확보 (버튼이 왼쪽에 있다면)
            )}
          >
            {tab.title}
          </Tabs.Trigger>

          <Button
            aria-label="remove tab"
            data-sortable-no-drag="true" class={cn(
              "delete absolute top-1/2 -translate-y-1/2 left-1 w-5 h-5 rounded-full flex items-center justify-center", // 위치 조정
              "invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200", // 호버 시 표시
              "bg-transparent hover:bg-red-500/30 text-white/70 hover:text-red-300" // 버튼 스타일
            )}
            onclick={removeTab(tab)}
            variant="ghost"
            size="icon"
          >
            <XIcon class="w-3 h-3" />
            <span class="sr-only">remove tab</span>
          </Button>
        </div>
      {/each}
    </div>

    <Button
      class="flex-none w-8 h-8 rounded-md"
      variant="ghost"
      size="icon"
      onclick={newTab}
    >
      <PlusIcon class="w-4 h-4" />
      <span class="sr-only">add new tab</span>
    </Button>
  </div>

  {#each tabItems as tab (tab.id)}
    <Tabs.Content value={tab.id} class="flex-1 h-full bg-amber-300 rounded-2xl overflow-scroll">
      {@render children?.()}
      {tab.title}
    </Tabs.Content>
  {/each}
</Tabs.Root>

<style>
  /* 스크롤바 숨기기 (Tailwind CSS 설정에 따라 app.css에 있을 수도 있음) */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* SortableJS가 추가하는 클래스에 대한 스타일 */
  :global(.sortable-ghost) {
    opacity: 0.2; /* 드래그 중인 아이템의 자리 표시자 */
    background: rgba(255, 255, 255, 0.1); /* 고스트 배경색 */
    border-radius: 0.375rem; /* rounded-md와 일치 */
  }
  :global(.sortable-drag) {
    opacity: 0.9; /* 드래그 중인 실제 아이템 */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
</style>
