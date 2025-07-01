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

# on:

### On this page

-   [on:](legacy-on.html)
-   [Component events](legacy-on.html#Component-events)

In runes mode, event handlers are just like any other attribute or prop.

In legacy mode, we use the `on:` directive:

App

<script>
	let count = 0;
	/** @param {MouseEvent} event */
	function handleClick(event) {
		count += 1;
	}
</script>
<button on:click={handleClick}>
	count: {count}
</button><script lang="ts">
	let count = 0;
	function handleClick(event: MouseEvent) {
		count += 1;
	}
</script>
<button on:click={handleClick}>
	count: {count}
</button>

Handlers can be declared inline with no performance penalty:

<button on:click={() => (count += 1)}>
	count: {count}
</button>

Add *modifiers* to element event handlers with the `|` character.

<form on:submit|preventDefault={handleSubmit}>
	<!-- the `submit` event's default is prevented,
	     so the page won't reload -->
</form>

The following modifiers are available:

-   `preventDefault` — calls `event.preventDefault()` before running the handler
-   `stopPropagation` — calls `event.stopPropagation()`, preventing the event reaching the next element
-   `stopImmediatePropagation` - calls `event.stopImmediatePropagation()`, preventing other listeners of the same event from being fired.
-   `passive` — improves scrolling performance on touch/wheel events (Svelte will add it automatically where it’s safe to do so)
-   `nonpassive` — explicitly set `passive: false`
-   `capture` — fires the handler during the *capture* phase instead of the *bubbling* phase
-   `once` — remove the handler after the first time it runs
-   `self` — only trigger handler if `event.target` is the element itself
-   `trusted` — only trigger handler if `event.isTrusted` is `true`. I.e. if the event is triggered by a user action.

Modifiers can be chained together, e.g. `on:click|once|capture={...}`.

If the `on:` directive is used without a value, the component will *forward* the event, meaning that a consumer of the component can listen for it.

<button on:click>
	The component itself will emit the click event
</button>

It’s possible to have multiple event listeners for the same event:

App

<script>
	let count = 0;
	function increment() {
		count += 1;
	}
	/** @param {MouseEvent} event */
	function log(event) {
		console.log(event);
	}
</script>
<button on:click={increment} on:click={log}>
	clicks: {count}
</button><script lang="ts">
	let count = 0;
	function increment() {
		count += 1;
	}
	function log(event: MouseEvent) {
		console.log(event);
	}
</script>
<button on:click={increment} on:click={log}>
	clicks: {count}
</button>

## Component events[](legacy-on.html#Component-events)

Components can dispatch events by creating a *dispatcher* when they are initialised:

Stepper

<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button><script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button>

`dispatch` creates a [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent). If a second argument is provided, it becomes the `detail` property of the event object.

A consumer of this component can listen for the dispatched events:

<script>
	import Stepper from './Stepper.svelte';
	let n = 0;
</script>
<Stepper
	on:decrement={() => n -= 1}
	on:increment={() => n += 1}
/>
<p>n: {n}</p>

Component events do not bubble — a parent component can only listen for events on its immediate children.

Other than `once`, modifiers are not valid on component event handlers.

> If you’re planning an eventual migration to Svelte 5, use callback props instead. This will make upgrading easier as `createEventDispatcher` is deprecated:
> 
> Stepper
> 
> <script>
> 	export let decrement;
> 	export let increment;
> </script>
> <button on:click={decrement}>decrement</button>
> <button on:click={increment}>increment</button><script lang="ts">
> 	export let decrement;
> 	export let increment;
> </script>
> <button on:click={decrement}>decrement</button>
> <button on:click={increment}>increment</button>

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/99-legacy/10-legacy-on.md)

previous next

[$$props and $$restProps](legacy-$$props-and-$$restProps.html) [<slot>](legacy-slots.html)