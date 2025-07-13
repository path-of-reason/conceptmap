SvelteTemplate syntax

# {@html ...}

### On this page

- [{@html ...}](@html.html)
- [Styling](@html.html#Styling)

To inject raw HTML into your component, use the `{@html ...}` tag:

<article>
	{@html content}
</article>

> Make sure that you either escape the passed string or only populate it with values that are under your control in order to prevent [XSS attacks](https://owasp.org/www-community/attacks/xss/). Never render unsanitized content.

The expression should be valid standalone HTML — this will not work, because `</div>` is not valid HTML:

{@html '<div>'}content{@html '</div>'}

It also will not compile Svelte code.

## Styling[](@html.html#Styling)

Content rendered this way is ‘invisible’ to Svelte and as such will not receive [scoped styles](scoped-styles.html) — in other words, this will not work, and the `a` and `img` styles will be regarded as unused:

<article>
	{@html content}
</article>
<style>
	article {
		a { color: hotpink }
		img { width: 100% }
	}
</style>

Instead, use the `:global` modifier to target everything inside the `<article>`:

<style>
	article :global {
		a { color: hotpink }
		img { width: 100% }
	}
</style>

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/03-template-syntax/08-@html.md)

previous next

[{@render ...}](@render.html) [{@const ...}](@const.html)
