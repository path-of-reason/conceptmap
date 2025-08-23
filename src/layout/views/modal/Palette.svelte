<script lang="ts">
  import { API } from "$lib/store/api";
  import type { Command } from "$lib/types/command";

  let searchQuery = $state("");
  let highlightedIndex = $state(-1);
  let searchInput: HTMLInputElement; // Declare searchInput
  let listElement: HTMLUListElement; // Declare listElement

  const allCommands = $derived(Array.from(API.command.commandMap.values()));
  const commandHistory = $derived(API.commandHistory.state.history);

  const fuzzyMatch = (pattern: string, text: string) => {
    const patternLower = pattern.toLowerCase();
    const textLower = text.toLowerCase();
    let patternIdx = 0;
    const matches: number[] = [];

    for (let textIdx = 0; textIdx < textLower.length; textIdx++) {
      if (
        patternIdx < patternLower.length &&
        textLower[textIdx] === patternLower[patternIdx]
      ) {
        matches.push(textIdx);
        patternIdx++;
      }
    }
    return patternIdx === patternLower.length ? matches : null;
  };

  const displayList = $derived.by(() => {
    const recentKeys = commandHistory.slice(0, 2);

    const sortedCommands = [...allCommands].sort((a, b) => {
      const aIsRecent = recentKeys.includes(a.key);
      const bIsRecent = recentKeys.includes(b.key);

      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;
      if (aIsRecent && bIsRecent) {
        return recentKeys.indexOf(a.key) - recentKeys.indexOf(b.key);
      }
      return a.description.localeCompare(b.description);
    });

    if (!searchQuery) {
      return sortedCommands.map((cmd) => ({
        command: cmd,
        matches: null,
        isRecent: recentKeys.includes(cmd.key),
      }));
    }

    const results: {
      command: Command;
      matches: number[] | null;
      isRecent: boolean;
    }[] = [];
    for (const cmd of sortedCommands) {
      const matches = fuzzyMatch(searchQuery, cmd.description);
      if (matches) {
        results.push({
          command: cmd,
          matches,
          isRecent: recentKeys.includes(cmd.key),
        });
      }
    }
    return results;
  });

  const highlightText = (text: string, matches: number[] | null) => {
    if (!matches || matches.length === 0) {
      return text;
    }
    let highlighted = "";
    let lastIdx = 0;
    for (const matchIdx of matches) {
      highlighted += text.substring(lastIdx, matchIdx);
      highlighted += `<strong class="text-yellow-300">${text[matchIdx]}</strong>`;
      lastIdx = matchIdx + 1;
    }
    highlighted += text.substring(lastIdx);
    return highlighted;
  };

  const executeAndClose = (commandKey: string) => {
    API.command.executeCommand(commandKey);
    API.commandHistory.addCommand(commandKey);
    // API.modal.closeModal();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        highlightedIndex =
          (highlightedIndex - 1 + displayList.length) % displayList.length;
        break;
      case "ArrowDown":
        e.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % displayList.length;
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && displayList[highlightedIndex]) {
          executeAndClose(displayList[highlightedIndex].command.key);
        }
        break;
      case "Escape":
        e.preventDefault();
        API.modal.closeModal();
        break;
    }
  };

  // Reset highlightedIndex when displayList changes
  $effect(() => {
    highlightedIndex = displayList.length > 0 ? 0 : -1;
  });

  // Auto-scroll to highlighted item
  $effect(() => {
    if (highlightedIndex >= 0 && listElement) {
      const selectedItem = listElement.children[
        highlightedIndex
      ] as HTMLLIElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  });

  // Export focusInput function
  export function focusInput() {
    searchInput.focus();
  }
</script>

<div
  class={[
    "w-[500px] max-w-[90vw]",
    "bg-gradient-to-r from-zinc-900 via-slate-950 to-black border border-zinc-700 rounded-lg",
    "p-4 z-1000 text-gray-100",
  ]}
  role="dialog"
  aria-modal="true"
>
  <input
    type="text"
    placeholder="Search commands..."
    class={[
      "w-full py-2 px-2.5 mb-3",
      "bg-zinc-800 border border-zinc-700 rounded-md text-gray-100",
      "box-border focus:outline-none focus:ring-2 focus:ring-zinc-500",
    ]}
    bind:value={searchQuery}
    onkeydown={handleKeyDown}
    bind:this={searchInput}
  />
  <ul
    bind:this={listElement}
    class="list-none p-0 m-0 max-h-[300px] h-fit overflow-y-auto transition"
  >
    {#each displayList as { command, matches, isRecent }, index (command.key)}
      <li
        class={[
          "py-2 px-3 cursor-pointer rounded-md text-gray-100",
          index === highlightedIndex
            ? "bg-zinc-600 text-white"
            : "bg-transparent",
          "hover:bg-slate-700",
        ]}
      >
        <button
          class="h-full w-full text-left flex justify-between items-center"
          onmousedown={(e) => e.preventDefault()}
          onclick={() => executeAndClose(command.key)}
        >
          <span>
            {@html highlightText(command.description, matches)}
          </span>
          {#if isRecent}
            <span
              class="text-xs text-gray-400 bg-zinc-700 px-1.5 py-0.5 rounded-md"
            >
              최근 사용
            </span>
          {/if}
        </button>
      </li>
    {:else}
      <li class="py-2 px-3 text-gray-300">No commands found.</li>
    {/each}
  </ul>
</div>
