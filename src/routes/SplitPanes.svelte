<script>
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import "../splitpanes.css";
</script>

<Splitpanes
  class=" rounded-lg overflow-hidden"
  theme="default-theme"
  style="height: 100%; width: 100%;"
  dblClickSplitter={false}
>
  <Pane size={3} minSize={3} maxSize={10} class="bg-red-400">
    <p>
      MenuBar - This is a splitpane, note how the splitters made static using
      CSS
    </p>
  </Pane>
  <Pane class="">
    <Splitpanes theme="modern-theme" class="">
      <Pane class="bg-white">
        <p>
          Folder
          <br />
          You can move those --&gt;
        </p>
      </Pane>
      <Pane class="bg-white">
        <p>Sample content</p>
      </Pane>
      <Pane class="bg-white">
        <p>
          Details
          <br />
          &lt;-- You can move those
        </p>
      </Pane>
    </Splitpanes>
  </Pane>
  <Pane size={6} minSize={6} maxSize={6} class="bg-white">
    <p>statusbar - and yet, another splitpane, same technique</p>
  </Pane>
</Splitpanes>
