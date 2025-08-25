<script lang="ts">
  import { NotesApi } from "$lib/store/notes.svelte";
  import Codemirror from "@/features/ObsidianEditor/Codemirror.svelte";

  let title: string = $state("");
  let content: string = $state("");
  let parent_uuid: string | null = $state(null); // 초기값은 null, 필요에 따라 변경

  const saveContent = (_doc: string) => {};

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    await NotesApi.addNote(title, content, parent_uuid);

    if (!NotesApi.state.error) {
      title = "";
      content = "";
      parent_uuid = null;
    }
  }
</script>

<div class="note-editor p-4 border rounded-lg shadow-sm bg-white">
  <h2 class="text-xl font-semibold mb-4">새 노트 작성</h2>
  <div class="mb-4">
    <label for="note-title" class="block text-sm font-medium text-gray-700"
      >제목</label
    >
    <input
      type="text"
      id="note-title"
      bind:value={title}
      class="mt-1 block w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      placeholder="노트 제목"
    />
  </div>
  <div class="mb-4">
    <label for="note-content" class="block text-sm font-medium text-gray-700"
      >내용</label
    >
    <textarea
      id="note-content"
      bind:value={content}
      class="mt-1 block w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-32"
      placeholder="노트 내용"
    ></textarea>
  </div>
  <div class="text-black w-full h-fit">{content}</div>
  <Codemirror initialDoc="" {saveContent} onBlur={() => console.log("blur")} />
  <button
    onclick={handleSubmit}
    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    노트 저장
  </button>
  {#if NotesApi.state.loading}
    <p class="text-indigo-600 mt-2">저장 중...</p>
  {/if}
  {#if NotesApi.state.error}
    <p class="text-red-600 mt-2">오류: {NotesApi.state.error}</p>
  {/if}
</div>
