<script lang="ts">
  import { Tabs, TabsContent } from "$lib/components/ui/tabs";
  import TabsList from "$lib/components/editor-tabs/editor-tabs-list.svelte";
  import TabsTrigger from "$lib/components/editor-tabs/editor-tabs-trigger.svelte";
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">에디터 스타일 탭 예제</h1>

  <Tabs value="file1.html" class="w-full max-w-2xl border rounded-md ">
    <TabsList>
      <TabsTrigger value="file1.html" class="">index.html</TabsTrigger>
      <TabsTrigger value="file2.css" class="">style.css</TabsTrigger>
      <TabsTrigger value="file3.js">script.js</TabsTrigger>
    </TabsList>
    <TabsContent value="file1.html" class="p-4">hello</TabsContent>
    <TabsContent value="file2.css" class="p-4">world</TabsContent>
    <TabsContent value="file3.js" class="p-4">
      <pre><code>console.log("Hello from script.js!");</code></pre>
    </TabsContent>
  </Tabs>
</div>
