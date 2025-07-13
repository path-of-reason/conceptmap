SvelteTemplate syntax

# {@render ...}

### On this page

- [{@render ...}](@render.html)
- [Optional snippets](@render.html#Optional-snippets)

To render a [snippet](snippet.html), use a `{@render ...}` tag.

{#snippet sum(a, b)}
<p>{a} + {b} = {a + b}</p>
{/snippet}
{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}

The expression can be an identifier like `sum`, or an arbitrary JavaScript expression:

{@render (cool ? coolSnippet : lameSnippet)()}

## Optional snippets[](@render.html#Optional-snippets)

If the snippet is potentially undefined — for example, because it’s an incoming prop — then you can use optional chaining to only render it when it _is_ defined:

{@render children?.()}

Alternatively, use an [`{#if ...}`](if.html) block with an `:else` clause to render fallback content:

{#if children}
{@render children()}
{:else}
<p>fallback content</p>
{/if}

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/03-template-syntax/07-@render.md)

previous next

[{#snippet ...}](snippet.html) [{@html ...}](@html.html)
