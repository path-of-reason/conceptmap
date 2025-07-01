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

SvelteRuntime

# Context

### On this page

-   [Context](context.html)
-   [Using context with state](context.html#Using-context-with-state)
-   [Type-safe context](context.html#Type-safe-context)
-   [Replacing global state](context.html#Replacing-global-state)

Context allows components to access values owned by parent components without passing them down as props (potentially through many layers of intermediate components, known as ‘prop-drilling’). The parent component sets context with `setContext(key, value)`...

Parent

<script>
	import { setContext } from 'svelte';
	setContext('my-context', 'hello from Parent.svelte');
</script><script lang="ts">
	import { setContext } from 'svelte';
	setContext('my-context', 'hello from Parent.svelte');
</script>

...and the child retrieves it with `getContext`:

Child

<script>
	import { getContext } from 'svelte';
	const message = getContext('my-context');
</script>
<h1>{message}, inside Child.svelte</h1><script lang="ts">
	import { getContext } from 'svelte';
	const message = getContext('my-context');
</script>
<h1>{message}, inside Child.svelte</h1>

This is particularly useful when `Parent.svelte` is not directly aware of `Child.svelte`, but instead renders it as part of a `children` [snippet](snippet.html) ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE42Q3W6DMAyFX8WyJgESK-oto6hTX2D3YxcM3IIUQpR40yqUd58CrCXsp7tL7HNsf2dAWXaEKR56yfTBGOOxFWQwfR6Qz8q1XAHjL-GjUhvzToJd7bU09FO9ctMkG0wxM5VuFeeFLLjtVK8ZnkpNkuGo-w6CTTJ9Z3PwsBAemlbUF934W8iy5DpaZtOUcU02-ZLcaS51jHEkTFm_kY1_wfOO8QnXrb8hBzDEc6pgZ4gFoyz4KgiD7nxfTe8ghqAhIfrJ46cTzVZBbkPlODVJsLCDO6V7ZcJoncyw1yRr0hd1GNn_ZbEM3I9i1bmVxOlWElUvDUNHxpQngt3C4CXzjS1rtvkw22wMrTRtTbC8Lkuabe7jvthPPe3DofYCAAA=)):

<Parent>
	<Child />
</Parent>

The key (`'my-context'`, in the example above) and the context itself can be any JavaScript value.

In addition to [`setContext`](svelte.html#setContext) and [`getContext`](svelte.html#getContext), Svelte exposes [`hasContext`](svelte.html#hasContext) and [`getAllContexts`](svelte.html#getAllContexts) functions.

## Using context with state[](context.html#Using-context-with-state)

You can store reactive state in context ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE41R0W6DMAz8FSuaBNUQdK8MkKZ-wh7HHihzu6hgosRMm1D-fUpSVNq12x4iEvvOx_kmQU2PIhfP3DCCJGgHYvxkkYid7NCI_GUS_KUcxhVEMjOelErNB3bsatvG4LW6n0ZsRC4K02qpuKqpZtmrQTNMYJA3QRAs7PTQQxS40eMCt3mX3duxnWb-lS5h7nTI0A4jMWoo4c44P_Hku-zrOazdy64chWo-ScfRkRgl8wgHKrLTH1OxHZkHgoHaTraHcopXUFYzPPVfuC_hwQaD1GrskdiNCdQwJljJqlvXfyqVsA5CGg0uRUQifHw56xFtciO75QrP07vo_JXf_tf8yK2ezDKY_ZWt_1y2qqYzv7bI1IW1V_sN19m-07wCAAA=))...

<script>
	import { setContext } from 'svelte';
	import Child from './Child.svelte';
	let counter = $state({
		count: 0
	});
	setContext('counter', counter);
</script>
<button onclick={() => counter.count += 1}>
	increment
</button>
<Child />
<Child />
<Child />

...though note that if you *reassign* `counter` instead of updating it, you will ‘break the link’ — in other words instead of this...

<button onclick={() => counter = { count: 0 }}>
	reset
</button>

...you must do this:

<button onclick={() => counter.count = 0}>
	reset
</button>

Svelte will warn you if you get it wrong.

## Type-safe context[](context.html#Type-safe-context)

A useful pattern is to wrap the calls to `setContext` and `getContext` inside helper functions that let you preserve type safety:

context

import { `function getContext<T>(key: any): T`

Retrieves the context that belongs to the closest parent component with the specified `key`.
Must be called during component initialisation.

getContext, `function setContext<T>(key: any, context: T): T`

Associates an arbitrary `context` object with the current component and the specified `key`
and returns that object. The context is then available to children of the component
(including slotted content) with `getContext`.

Like lifecycle functions, this must be called during component initialisation.

setContext } from 'svelte';
let `let key: {}`key = {};
/** @param {User} user */
export function `function setUserContext(user: User): void`

@paramuser 

setUserContext(`user: User`

@paramuser 

user) {
	`setContext<User>(key: any, context: User): User`

Associates an arbitrary `context` object with the current component and the specified `key`
and returns that object. The context is then available to children of the component
(including slotted content) with `getContext`.

Like lifecycle functions, this must be called during component initialisation.

setContext(`let key: {}`key, `user: User`

@paramuser 

user);
}
export function `function getUserContext(): User`getUserContext() {
	return /** @type {User} */ (`getContext<User>(key: any): User`

Retrieves the context that belongs to the closest parent component with the specified `key`.
Must be called during component initialisation.

getContext(`let key: {}`key));
}import { `function getContext<T>(key: any): T`

Retrieves the context that belongs to the closest parent component with the specified `key`.
Must be called during component initialisation.

getContext, `function setContext<T>(key: any, context: T): T`

Associates an arbitrary `context` object with the current component and the specified `key`
and returns that object. The context is then available to children of the component
(including slotted content) with `getContext`.

Like lifecycle functions, this must be called during component initialisation.

setContext } from 'svelte';
let `let key: {}`key = {};
export function `function setUserContext(user: User): void`setUserContext(`user: User`user: User) {
	`setContext<User>(key: any, context: User): User`

Associates an arbitrary `context` object with the current component and the specified `key`
and returns that object. The context is then available to children of the component
(including slotted content) with `getContext`.

Like lifecycle functions, this must be called during component initialisation.

setContext(`let key: {}`key, `user: User`user);
}
export function `function getUserContext(): User`getUserContext() {
	return `getContext<User>(key: any): User`

Retrieves the context that belongs to the closest parent component with the specified `key`.
Must be called during component initialisation.

getContext(`let key: {}`key) as User;
}

## Replacing global state[](context.html#Replacing-global-state)

When you have state shared by many different components, you might be tempted to put it in its own module and just import it wherever it’s needed:

state.svelte

export const `const myGlobalState: {     user: {}; }`myGlobalState = `function $state<{     user: {}; }>(initial: {     user: {}; }): {     user: {}; } (+1 overload) namespace $state`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state({
	`user: {}`user: {
		// ...
	}
	// ...
});

In many cases this is perfectly fine, but there is a risk: if you mutate the state during server-side rendering (which is discouraged, but entirely possible!)...

App

<script>
	import { myGlobalState } from 'svelte';
	let { data } = $props();
	if (data.user) {
		myGlobalState.user = data.user;
	}
</script><script lang="ts">
	import { myGlobalState } from 'svelte';
	let { data } = $props();
	if (data.user) {
		myGlobalState.user = data.user;
	}
</script>

...then the data may be accessible by the *next* user. Context solves this problem because it is not shared between requests.

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/06-runtime/02-context.md)

previous next

[Stores](stores.html) [Lifecycle hooks](lifecycle-hooks.html)