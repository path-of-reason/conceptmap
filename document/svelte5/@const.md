SvelteTemplate syntax

# {@const ...}

### On this page

- [{@const ...}](@const.html)

The `{@const ...}` tag defines a local constant.

{#each boxes as box}
{@const area = box.width _ box.height}
{box.width} _ {box.height} = {area}
{/each}

`{@const}` is only allowed as an immediate child of a block — `{#if ...}`, `{#each ...}`, `{#snippet ...}` and so on — a `<Component />` or a `<svelte:boundary>`.

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/03-template-syntax/09-@const.md)

previous next

[{@html ...}](@html.html) [{@debug ...}](@debug.html)
