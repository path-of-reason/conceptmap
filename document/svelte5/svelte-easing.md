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

# svelte/easing

### On this page

-   [svelte/easing](svelte-easing.html)
-   [backIn](svelte-easing.html#backIn)
-   [backInOut](svelte-easing.html#backInOut)
-   [backOut](svelte-easing.html#backOut)
-   [bounceIn](svelte-easing.html#bounceIn)
-   [bounceInOut](svelte-easing.html#bounceInOut)
-   [bounceOut](svelte-easing.html#bounceOut)
-   [circIn](svelte-easing.html#circIn)
-   [circInOut](svelte-easing.html#circInOut)
-   [circOut](svelte-easing.html#circOut)
-   [cubicIn](svelte-easing.html#cubicIn)
-   [cubicInOut](svelte-easing.html#cubicInOut)
-   [cubicOut](svelte-easing.html#cubicOut)
-   [elasticIn](svelte-easing.html#elasticIn)
-   [elasticInOut](svelte-easing.html#elasticInOut)
-   [elasticOut](svelte-easing.html#elasticOut)
-   [expoIn](svelte-easing.html#expoIn)
-   [expoInOut](svelte-easing.html#expoInOut)
-   [expoOut](svelte-easing.html#expoOut)
-   [linear](svelte-easing.html#linear)
-   [quadIn](svelte-easing.html#quadIn)
-   [quadInOut](svelte-easing.html#quadInOut)
-   [quadOut](svelte-easing.html#quadOut)
-   [quartIn](svelte-easing.html#quartIn)
-   [quartInOut](svelte-easing.html#quartInOut)
-   [quartOut](svelte-easing.html#quartOut)
-   [quintIn](svelte-easing.html#quintIn)
-   [quintInOut](svelte-easing.html#quintInOut)
-   [quintOut](svelte-easing.html#quintOut)
-   [sineIn](svelte-easing.html#sineIn)
-   [sineInOut](svelte-easing.html#sineInOut)
-   [sineOut](svelte-easing.html#sineOut)

import {
	`function backIn(t: number): number`backIn,
	`function backInOut(t: number): number`backInOut,
	`function backOut(t: number): number`backOut,
	`function bounceIn(t: number): number`bounceIn,
	`function bounceInOut(t: number): number`bounceInOut,
	`function bounceOut(t: number): number`bounceOut,
	`function circIn(t: number): number`circIn,
	`function circInOut(t: number): number`circInOut,
	`function circOut(t: number): number`circOut,
	`function cubicIn(t: number): number`cubicIn,
	`function cubicInOut(t: number): number`cubicInOut,
	`function cubicOut(t: number): number`cubicOut,
	`function elasticIn(t: number): number`elasticIn,
	`function elasticInOut(t: number): number`elasticInOut,
	`function elasticOut(t: number): number`elasticOut,
	`function expoIn(t: number): number`expoIn,
	`function expoInOut(t: number): number`expoInOut,
	`function expoOut(t: number): number`expoOut,
	`function linear(t: number): number`linear,
	`function quadIn(t: number): number`quadIn,
	`function quadInOut(t: number): number`quadInOut,
	`function quadOut(t: number): number`quadOut,
	`function quartIn(t: number): number`quartIn,
	`function quartInOut(t: number): number`quartInOut,
	`function quartOut(t: number): number`quartOut,
	`function quintIn(t: number): number`quintIn,
	`function quintInOut(t: number): number`quintInOut,
	`function quintOut(t: number): number`quintOut,
	`function sineIn(t: number): number`sineIn,
	`function sineInOut(t: number): number`sineInOut,
	`function sineOut(t: number): number`sineOut
} from 'svelte/easing';

## backIn[](svelte-easing.html#backIn)

function backIn(t: number): number;

## backInOut[](svelte-easing.html#backInOut)

function backInOut(t: number): number;

## backOut[](svelte-easing.html#backOut)

function backOut(t: number): number;

## bounceIn[](svelte-easing.html#bounceIn)

function bounceIn(t: number): number;

## bounceInOut[](svelte-easing.html#bounceInOut)

function bounceInOut(t: number): number;

## bounceOut[](svelte-easing.html#bounceOut)

function bounceOut(t: number): number;

## circIn[](svelte-easing.html#circIn)

function circIn(t: number): number;

## circInOut[](svelte-easing.html#circInOut)

function circInOut(t: number): number;

## circOut[](svelte-easing.html#circOut)

function circOut(t: number): number;

## cubicIn[](svelte-easing.html#cubicIn)

function cubicIn(t: number): number;

## cubicInOut[](svelte-easing.html#cubicInOut)

function cubicInOut(t: number): number;

## cubicOut[](svelte-easing.html#cubicOut)

function cubicOut(t: number): number;

## elasticIn[](svelte-easing.html#elasticIn)

function elasticIn(t: number): number;

## elasticInOut[](svelte-easing.html#elasticInOut)

function elasticInOut(t: number): number;

## elasticOut[](svelte-easing.html#elasticOut)

function elasticOut(t: number): number;

## expoIn[](svelte-easing.html#expoIn)

function expoIn(t: number): number;

## expoInOut[](svelte-easing.html#expoInOut)

function expoInOut(t: number): number;

## expoOut[](svelte-easing.html#expoOut)

function expoOut(t: number): number;

## linear[](svelte-easing.html#linear)

function linear(t: number): number;

## quadIn[](svelte-easing.html#quadIn)

function quadIn(t: number): number;

## quadInOut[](svelte-easing.html#quadInOut)

function quadInOut(t: number): number;

## quadOut[](svelte-easing.html#quadOut)

function quadOut(t: number): number;

## quartIn[](svelte-easing.html#quartIn)

function quartIn(t: number): number;

## quartInOut[](svelte-easing.html#quartInOut)

function quartInOut(t: number): number;

## quartOut[](svelte-easing.html#quartOut)

function quartOut(t: number): number;

## quintIn[](svelte-easing.html#quintIn)

function quintIn(t: number): number;

## quintInOut[](svelte-easing.html#quintInOut)

function quintInOut(t: number): number;

## quintOut[](svelte-easing.html#quintOut)

function quintOut(t: number): number;

## sineIn[](svelte-easing.html#sineIn)

function sineIn(t: number): number;

## sineInOut[](svelte-easing.html#sineInOut)

function sineInOut(t: number): number;

## sineOut[](svelte-easing.html#sineOut)

function sineOut(t: number): number;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-easing.md)

previous next

[svelte/compiler](svelte-compiler.html) [svelte/events](svelte-events.html)