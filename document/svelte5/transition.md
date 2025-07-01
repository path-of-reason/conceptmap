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

SvelteTemplate syntax

# transition:

### On this page

-   [transition:](transition.html)
-   [Built-in transitions](transition.html#Built-in-transitions)
-   [Local vs global](transition.html#Local-vs-global)
-   [Transition parameters](transition.html#Transition-parameters)
-   [Custom transition functions](transition.html#Custom-transition-functions)
-   [Transition events](transition.html#Transition-events)

A *transition* is triggered by an element entering or leaving the DOM as a result of a state change.

When a block (such as an `{#if ...}` block) is transitioning out, all elements inside it, including those that do not have their own transitions, are kept in the DOM until every transition in the block has been completed.

The `transition:` directive indicates a *bidirectional* transition, which means it can be smoothly reversed while the transition is in progress.

<script>
	import { fade } from 'svelte/transition';
	let visible = $state(false);
</script>
<button onclick={() => visible = !visible}>toggle</button>
{#if visible}
	<div transition:fade>fades in and out</div>
{/if}

## Built-in transitions[](transition.html#Built-in-transitions)

A selection of built-in transitions can be imported from the [`svelte/transition`](svelte-transition.html) module.

## Local vs global[](transition.html#Local-vs-global)

Transitions are local by default. Local transitions only play when the block they belong to is created or destroyed, *not* when parent blocks are created or destroyed.

{#if x}
	{#if y}
		<p transition:fade>fades in and out only when y changes</p>
		<p transition:fade|global>fades in and out when x or y change</p>
	{/if}
{/if}

## Transition parameters[](transition.html#Transition-parameters)

Transitions can have parameters.

(The double `{{curlies}}` aren’t a special syntax; this is an object literal inside an expression tag.)

{#if visible}
	<div transition:fade={{ duration: 2000 }}>fades in and out over two seconds</div>
{/if}

## Custom transition functions[](transition.html#Custom-transition-functions)

transition = (`node: HTMLElement`node: HTMLElement, `params: any`params: any, `options: {     direction: "in" | "out" | "both"; }`options: { `direction: "in" | "out" | "both"`direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (`t: number`t: number) => number,
	css?: (`t: number`t: number, `u: number`u: number) => string,
	tick?: (`t: number`t: number, `u: number`u: number) => void
}

Transitions can use custom functions. If the returned object has a `css` function, Svelte will generate keyframes for a [web animation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

The `t` argument passed to `css` is a value between `0` and `1` after the `easing` function has been applied. *In* transitions run from `0` to `1`, *out* transitions run from `1` to `0` — in other words, `1` is the element’s natural state, as though no transition had been applied. The `u` argument is equal to `1 - t`.

The function is called repeatedly *before* the transition begins, with different `t` and `u` arguments.

App

<script>
	import { elasticOut } from 'svelte/easing';
	/** @type {boolean} */
	export let visible;
	/**
	 * @param {HTMLElement} node
	 * @param {{ delay?: number, duration?: number, easing?: (t: number) => number }} params
	 */
	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>
{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}<script lang="ts">
	import { elasticOut } from 'svelte/easing';
	export let visible: boolean;
	function whoosh(node: HTMLElement, params: { delay?: number, duration?: number, easing?: (t: number) => number }) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>
{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}

A custom transition function can also return a `tick` function, which is called *during* the transition with the same `t` and `u` arguments.

> If it’s possible to use `css` instead of `tick`, do so — web animations can run off the main thread, preventing jank on slower devices.

App

<script>
	export let visible = false;
	/**
	 * @param {HTMLElement} node
	 * @param {{ speed?: number }} params
	 */
	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;
		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}
		const text = node.textContent;
		const duration = text.length / (speed * 0.01);
		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>
{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}<script lang="ts">
	export let visible = false;
	function typewriter(node: HTMLElement, { speed = 1 }: { speed?: number }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;
		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}
		const text = node.textContent;
		const duration = text.length / (speed * 0.01);
		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>
{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}

If a transition returns a function instead of a transition object, the function will be called in the next microtask. This allows multiple transitions to coordinate, making [crossfade effects](https://svelte.dev/tutorial/deferred-transitions) possible.

Transition functions also receive a third argument, `options`, which contains information about the transition.

Available values in the `options` object are:

-   `direction` - one of `in`, `out`, or `both` depending on the type of transition

## Transition events[](transition.html#Transition-events)

An element with transitions will dispatch the following events in addition to any standard DOM events:

-   `introstart`
-   `introend`
-   `outrostart`
-   `outroend`

{#if visible}
	<p
		transition:fly={{ y: 200, duration: 2000 }}
		onintrostart={() => (status = 'intro started')}
		onoutrostart={() => (status = 'outro started')}
		onintroend={() => (status = 'intro ended')}
		onoutroend={() => (status = 'outro ended')}
	>
		Flies in and out
	</p>
{/if}

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/03-template-syntax/13-transition.md)

previous next

[use:](use.html) [in: and out:](in-and-out.html)