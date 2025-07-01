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

SvelteReference

# svelte/reactivity/window

### On this page

-   [svelte/reactivity/window](svelte-reactivity-window.html)
-   [devicePixelRatio](svelte-reactivity-window.html#devicePixelRatio)
-   [innerHeight](svelte-reactivity-window.html#innerHeight)
-   [innerWidth](svelte-reactivity-window.html#innerWidth)
-   [online](svelte-reactivity-window.html#online)
-   [outerHeight](svelte-reactivity-window.html#outerHeight)
-   [outerWidth](svelte-reactivity-window.html#outerWidth)
-   [screenLeft](svelte-reactivity-window.html#screenLeft)
-   [screenTop](svelte-reactivity-window.html#screenTop)
-   [scrollX](svelte-reactivity-window.html#scrollX)
-   [scrollY](svelte-reactivity-window.html#scrollY)

This module exports reactive versions of various `window` values, each of which has a reactive `current` property that you can reference in reactive contexts (templates, [deriveds]($derived.html) and [effects]($effect.html)) without using [`<svelte:window>`](svelte-window.html) bindings or manually creating your own event listeners.

<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>
<p>{innerWidth.current}x{innerHeight.current}</p>

import {
	`const devicePixelRatio: {     readonly current: number | undefined; }`

`devicePixelRatio.current` is a reactive view of `window.devicePixelRatio`. On the server it is `undefined`.
Note that behaviour differs between browsers — on Chrome it will respond to the current zoom level,
on Firefox and Safari it won’t.

@since5.11.0

devicePixelRatio,
	`const innerHeight: ReactiveValue<number | undefined>`

`innerHeight.current` is a reactive view of `window.innerHeight`. On the server it is `undefined`.

@since5.11.0

innerHeight,
	`const innerWidth: ReactiveValue<number | undefined>`

`innerWidth.current` is a reactive view of `window.innerWidth`. On the server it is `undefined`.

@since5.11.0

innerWidth,
	`const online: ReactiveValue<boolean | undefined>`

`online.current` is a reactive view of `navigator.onLine`. On the server it is `undefined`.

@since5.11.0

online,
	`const outerHeight: ReactiveValue<number | undefined>`

`outerHeight.current` is a reactive view of `window.outerHeight`. On the server it is `undefined`.

@since5.11.0

outerHeight,
	`const outerWidth: ReactiveValue<number | undefined>`

`outerWidth.current` is a reactive view of `window.outerWidth`. On the server it is `undefined`.

@since5.11.0

outerWidth,
	`const screenLeft: ReactiveValue<number | undefined>`

`screenLeft.current` is a reactive view of `window.screenLeft`. It is updated inside a `requestAnimationFrame` callback. On the server it is `undefined`.

@since5.11.0

screenLeft,
	`const screenTop: ReactiveValue<number | undefined>`

`screenTop.current` is a reactive view of `window.screenTop`. It is updated inside a `requestAnimationFrame` callback. On the server it is `undefined`.

@since5.11.0

screenTop,
	`const scrollX: ReactiveValue<number | undefined>`

`scrollX.current` is a reactive view of `window.scrollX`. On the server it is `undefined`.

@since5.11.0

scrollX,
	`const scrollY: ReactiveValue<number | undefined>`

`scrollY.current` is a reactive view of `window.scrollY`. On the server it is `undefined`.

@since5.11.0

scrollY
} from 'svelte/reactivity/window';

## devicePixelRatio[](svelte-reactivity-window.html#devicePixelRatio)

> Available since 5.11.0

`devicePixelRatio.current` is a reactive view of `window.devicePixelRatio`. On the server it is `undefined`. Note that behaviour differs between browsers — on Chrome it will respond to the current zoom level, on Firefox and Safari it won’t.

const devicePixelRatio: {
	get current(): number | undefined;
};

## innerHeight[](svelte-reactivity-window.html#innerHeight)

> Available since 5.11.0

`innerHeight.current` is a reactive view of `window.innerHeight`. On the server it is `undefined`.

const innerHeight: ReactiveValue<number | undefined>;

## innerWidth[](svelte-reactivity-window.html#innerWidth)

> Available since 5.11.0

`innerWidth.current` is a reactive view of `window.innerWidth`. On the server it is `undefined`.

const innerWidth: ReactiveValue<number | undefined>;

## online[](svelte-reactivity-window.html#online)

> Available since 5.11.0

`online.current` is a reactive view of `navigator.onLine`. On the server it is `undefined`.

const online: ReactiveValue<boolean | undefined>;

## outerHeight[](svelte-reactivity-window.html#outerHeight)

> Available since 5.11.0

`outerHeight.current` is a reactive view of `window.outerHeight`. On the server it is `undefined`.

const outerHeight: ReactiveValue<number | undefined>;

## outerWidth[](svelte-reactivity-window.html#outerWidth)

> Available since 5.11.0

`outerWidth.current` is a reactive view of `window.outerWidth`. On the server it is `undefined`.

const outerWidth: ReactiveValue<number | undefined>;

## screenLeft[](svelte-reactivity-window.html#screenLeft)

> Available since 5.11.0

`screenLeft.current` is a reactive view of `window.screenLeft`. It is updated inside a `requestAnimationFrame` callback. On the server it is `undefined`.

const screenLeft: ReactiveValue<number | undefined>;

## screenTop[](svelte-reactivity-window.html#screenTop)

> Available since 5.11.0

`screenTop.current` is a reactive view of `window.screenTop`. It is updated inside a `requestAnimationFrame` callback. On the server it is `undefined`.

const screenTop: ReactiveValue<number | undefined>;

## scrollX[](svelte-reactivity-window.html#scrollX)

> Available since 5.11.0

`scrollX.current` is a reactive view of `window.scrollX`. On the server it is `undefined`.

const scrollX: ReactiveValue<number | undefined>;

## scrollY[](svelte-reactivity-window.html#scrollY)

> Available since 5.11.0

`scrollY.current` is a reactive view of `window.scrollY`. On the server it is `undefined`.

const scrollY: ReactiveValue<number | undefined>;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-reactivity-window.md)

previous next

[svelte/motion](svelte-motion.html) [svelte/reactivity](svelte-reactivity.html)