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

# export let

### On this page

-   [export let](legacy-export-let.html)
-   [Component exports](legacy-export-let.html#Component-exports)
-   [Renaming props](legacy-export-let.html#Renaming-props)

In runes mode, [component props](basic-markup.html#Component-props) are declared with the [`$props`]($props.html) rune, allowing parent components to pass in data.

In legacy mode, props are marked with the `export` keyword, and can have a default value:

<script>
	export let foo;
	export let bar = 'default value';
	// Values that are passed in as props
	// are immediately available
	console.log({ foo });
</script>

The default value is used if it would otherwise be `undefined` when the component is created.

> Unlike in runes mode, if the parent component changes a prop from a defined value to `undefined`, it does not revert to the initial value.

Props without default values are considered *required*, and Svelte will print a warning during development if no value is provided, which you can squelch by specifying `undefined` as the default value:

export let `let foo: undefined`foo = `var undefined`undefined;

## Component exports[](legacy-export-let.html#Component-exports)

An exported `const`, `class` or `function` declaration is *not* considered a prop — instead, it becomes part of the component’s API:

Greeter

<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script><script lang="ts">
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>

App

<script>
	import Greeter from './Greeter.svelte';
	let greeter;
</script>
<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>
	greet
</button><script lang="ts">
	import Greeter from './Greeter.svelte';
	let greeter;
</script>
<Greeter bind:this={greeter} />
<button on:click={() => greeter.greet('world')}>
	greet
</button>

## Renaming props[](legacy-export-let.html#Renaming-props)

The `export` keyword can appear separately from the declaration. This is useful for renaming props, for example in the case of a reserved word:

App

<script>
	/** @type {string} */
	let className;
	// creates a `class` property, even
	// though it is a reserved word
	export { className as class };
</script><script lang="ts">
	let className: string;
	// creates a `class` property, even
	// though it is a reserved word
	export { className as class };
</script>

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/99-legacy/03-legacy-export-let.md)

previous next

[Reactive $: statements](legacy-reactive-assignments.html) [$$props and $$restProps](legacy-$$props-and-$$restProps.html)