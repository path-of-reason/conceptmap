-   ### Introduction
    
    -   [Overview](overview.html)
    -   [Getting started](getting-started.html)
    -   [.svelte files](svelte-files.html)
    -   [.svelte.js and .svelte.ts files](svelte-js-files.html)
-   ### Runes
    
    -   [What are runes?](what-are-runes.html)
    -   [$state]($state.html)
    -   [$derived]($derived.html)
    -   [$effect]($effect.html)
    -   [$props]($props.html)
    -   [$bindable]($bindable.html)
    -   [$inspect]($inspect.html)
    -   [$host]($host.html)
-   ### Template syntax
    
    -   [Basic markup](basic-markup.html)
    -   [{#if ...}](if.html)
    -   [{#each ...}](each.html)
    -   [{#key ...}](key.html)
    -   [{#await ...}](await.html)
    -   [{#snippet ...}](snippet.html)
    -   [{@render ...}](@render.html)
    -   [{@html ...}](@html.html)
    -   [{@const ...}](@const.html)
    -   [{@debug ...}](@debug.html)
    -   [bind:](bind.html)
    -   [use:](use.html)
    -   [transition:](transition.html)
    -   [in: and out:](in-and-out.html)
    -   [animate:](animate.html)
    -   [style:](style.html)
    -   [class](class.html)
-   ### Styling
    
    -   [Scoped styles](scoped-styles.html)
    -   [Global styles](global-styles.html)
    -   [Custom properties](custom-properties.html)
    -   [Nested <style> elements](nested-style-elements.html)
-   ### Special elements
    
    -   [<svelte:boundary>](svelte-boundary.html)
    -   [<svelte:window>](svelte-window.html)
    -   [<svelte:document>](svelte-document.html)
    -   [<svelte:body>](svelte-body.html)
    -   [<svelte:head>](svelte-head.html)
    -   [<svelte:element>](svelte-element.html)
    -   [<svelte:options>](svelte-options.html)
-   ### Runtime
    
    -   [Stores](stores.html)
    -   [Context](context.html)
    -   [Lifecycle hooks](lifecycle-hooks.html)
    -   [Imperative component API](imperative-component-api.html)
-   ### Misc
    
    -   [Testing](testing.html)
    -   [TypeScript](typescript.html)
    -   [Custom elements](custom-elements.html)
    -   [Svelte 4 migration guide](v4-migration-guide.html)
    -   [Svelte 5 migration guide](v5-migration-guide.html)
    -   [Frequently asked questions](faq.html)
-   ### Reference
    
    -   [svelte](svelte.html)
    -   [svelte/action](svelte-action.html)
    -   [svelte/animate](svelte-animate.html)
    -   [svelte/compiler](svelte-compiler.html)
    -   [svelte/easing](svelte-easing.html)
    -   [svelte/events](svelte-events.html)
    -   [svelte/legacy](svelte-legacy.html)
    -   [svelte/motion](svelte-motion.html)
    -   [svelte/reactivity/window](svelte-reactivity-window.html)
    -   [svelte/reactivity](svelte-reactivity.html)
    -   [svelte/server](svelte-server.html)
    -   [svelte/store](svelte-store.html)
    -   [svelte/transition](svelte-transition.html)
    -   [Compiler errors](compiler-errors.html)
    -   [Compiler warnings](compiler-warnings.html)
    -   [Runtime errors](runtime-errors.html)
    -   [Runtime warnings](runtime-warnings.html)
-   ### Legacy APIs
    
    -   [Overview](legacy-overview.html)
    -   [Reactive let/var declarations](legacy-let.html)
    -   [Reactive $: statements](legacy-reactive-assignments.html)
    -   [export let](legacy-export-let.html)
    -   [$$props and $$restProps](legacy-$$props-and-$$restProps.html)
    -   [on:](legacy-on.html)
    -   [<slot>](legacy-slots.html)
    -   [$$slots](legacy-$$slots.html)
    -   [<svelte:fragment>](legacy-svelte-fragment.html)
    -   [<svelte:component>](legacy-svelte-component.html)
    -   [<svelte:self>](legacy-svelte-self.html)
    -   [Imperative component API](legacy-component-api.html)

SvelteLegacy APIs

# <slot>

### On this page

-   [<slot>](legacy-slots.html)
-   [Named slots](legacy-slots.html#Named-slots)
-   [Fallback content](legacy-slots.html#Fallback-content)
-   [Passing data to slotted content](legacy-slots.html#Passing-data-to-slotted-content)

In Svelte 5, content can be passed to components in the form of [snippets](snippet.html) and rendered using [render tags](@render.html).

In legacy mode, content inside component tags is considered *slotted content*, which can be rendered by the component using a `<slot>` element:

App

<script>
	import Modal from './Modal.svelte';
</script>
<Modal>This is some slotted content</Modal><script lang="ts">
	import Modal from './Modal.svelte';
</script>
<Modal>This is some slotted content</Modal>

Modal

<div class="modal">
	<slot></slot>
</div>

> If you want to render a regular `<slot>` element, you can use `<svelte:element this={'slot'} />`.

## Named slots[](legacy-slots.html#Named-slots)

A component can have *named* slots in addition to the default slot. On the parent side, add a `slot="..."` attribute to an element, component or [`<svelte:fragment>`](legacy-svelte-fragment.html) directly inside the component tags.

App

<script>
	import Modal from './Modal.svelte';
	let open = true;
</script>
{#if open}
	<Modal>
		This is some slotted content
		<div slot="buttons">
			<button on:click={() => open = false}>
				close
			</button>
		</div>
	</Modal>
{/if}<script lang="ts">
	import Modal from './Modal.svelte';
	let open = true;
</script>
{#if open}
	<Modal>
		This is some slotted content
		<div slot="buttons">
			<button on:click={() => open = false}>
				close
			</button>
		</div>
	</Modal>
{/if}

On the child side, add a corresponding `<slot name="...">` element:

Modal

<div class="modal">
	<slot></slot>
	<hr>
	<slot name="buttons"></slot>
</div>

## Fallback content[](legacy-slots.html#Fallback-content)

If no slotted content is provided, a component can define fallback content by putting it inside the `<slot>` element:

<slot>
	This will be rendered if no slotted content is provided
</slot>

## Passing data to slotted content[](legacy-slots.html#Passing-data-to-slotted-content)

Slots can be rendered zero or more times and can pass values *back* to the parent using props. The parent exposes the values to the slot template using the `let:` directive.

FancyList

<ul>
	{#each items as data}
		<li class="fancy">
			<!-- 'item' here... -->
			<slot item={process(data)} />
		</li>
	{/each}
</ul>

App

<!-- ...corresponds to 'item' here: -->
<FancyList {items} let:item={processed}>
	<div>{processed.text}</div>
</FancyList>

The usual shorthand rules apply — `let:item` is equivalent to `let:item={item}`, and `<slot {item}>` is equivalent to `<slot item={item}>`.

Named slots can also expose values. The `let:` directive goes on the element with the `slot` attribute.

FancyList

<ul>
	{#each items as item}
		<li class="fancy">
			<slot name="item" item={process(data)} />
		</li>
	{/each}
</ul>
<slot name="footer" />

App

<FancyList {items}>
	<div slot="item" let:item>{item.text}</div>
	<p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/99-legacy/20-legacy-slots.md)

previous next

[on:](legacy-on.html) [$$slots](legacy-$$slots.html)