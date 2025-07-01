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

# svelte/transition

### On this page

-   [svelte/transition](svelte-transition.html)
-   [blur](svelte-transition.html#blur)
-   [crossfade](svelte-transition.html#crossfade)
-   [draw](svelte-transition.html#draw)
-   [fade](svelte-transition.html#fade)
-   [fly](svelte-transition.html#fly)
-   [scale](svelte-transition.html#scale)
-   [slide](svelte-transition.html#slide)
-   [BlurParams](svelte-transition.html#BlurParams)
-   [CrossfadeParams](svelte-transition.html#CrossfadeParams)
-   [DrawParams](svelte-transition.html#DrawParams)
-   [EasingFunction](svelte-transition.html#EasingFunction)
-   [FadeParams](svelte-transition.html#FadeParams)
-   [FlyParams](svelte-transition.html#FlyParams)
-   [ScaleParams](svelte-transition.html#ScaleParams)
-   [SlideParams](svelte-transition.html#SlideParams)
-   [TransitionConfig](svelte-transition.html#TransitionConfig)

import {
	`function blur(node: Element, { delay, duration, easing, amount, opacity }?: BlurParams | undefined): TransitionConfig`

Animates a `blur` filter alongside an element’s opacity.

blur,
	`function crossfade({ fallback, ...defaults }: CrossfadeParams & {     fallback?: (node: Element, params: CrossfadeParams, intro: boolean) => TransitionConfig; }): [(node: any, params: CrossfadeParams & {     key: any; }) => () => TransitionConfig, (node: any, params: CrossfadeParams & {     key: any; }) => () => TransitionConfig]`

The `crossfade` function creates a pair of [transitions](transition.html) called `send` and `receive`. When an element is ‘sent’, it looks for a corresponding element being ‘received’, and generates a transition that transforms the element to its counterpart’s position and fades it out. When an element is ‘received’, the reverse happens. If there is no counterpart, the `fallback` transition is used.

crossfade,
	`function draw(node: SVGElement & {     getTotalLength(): number; }, { delay, speed, duration, easing }?: DrawParams | undefined): TransitionConfig`

Animates the stroke of an SVG element, like a snake in a tube. `in` transitions begin with the path invisible and draw the path to the screen over time. `out` transitions start in a visible state and gradually erase the path. `draw` only works with elements that have a `getTotalLength` method, like `&#x3C;path>` and `&#x3C;polyline>`.

draw,
	`function fade(node: Element, { delay, duration, easing }?: FadeParams | undefined): TransitionConfig`

Animates the opacity of an element from 0 to the current opacity for `in` transitions and from the current opacity to 0 for `out` transitions.

fade,
	`function fly(node: Element, { delay, duration, easing, x, y, opacity }?: FlyParams | undefined): TransitionConfig`

Animates the x and y positions and the opacity of an element. `in` transitions animate from the provided values, passed as parameters to the element’s default values. `out` transitions animate from the element’s default values to the provided values.

fly,
	`function scale(node: Element, { delay, duration, easing, start, opacity }?: ScaleParams | undefined): TransitionConfig`

Animates the opacity and scale of an element. `in` transitions animate from the provided values, passed as parameters, to an element’s current (default) values. `out` transitions animate from an element’s default values to the provided values.

scale,
	`function slide(node: Element, { delay, duration, easing, axis }?: SlideParams | undefined): TransitionConfig`

Slides an element in and out.

slide
} from 'svelte/transition';

## blur[](svelte-transition.html#blur)

Animates a `blur` filter alongside an element’s opacity.

function blur(
	node: Element,
	{
		delay,
		duration,
		easing,
		amount,
		opacity
	}?: BlurParams | undefined
): TransitionConfig;

## crossfade[](svelte-transition.html#crossfade)

The `crossfade` function creates a pair of [transitions](transition.html) called `send` and `receive`. When an element is ‘sent’, it looks for a corresponding element being ‘received’, and generates a transition that transforms the element to its counterpart’s position and fades it out. When an element is ‘received’, the reverse happens. If there is no counterpart, the `fallback` transition is used.

function crossfade({
	fallback,
	...defaults
}: CrossfadeParams & {
	fallback?: (
		node: Element,
		params: CrossfadeParams,
		intro: boolean
	) => TransitionConfig;
}): [
	(
		node: any,
		params: CrossfadeParams & {
			key: any;
		}
	) => () => TransitionConfig,
	(
		node: any,
		params: CrossfadeParams & {
			key: any;
		}
	) => () => TransitionConfig
];

## draw[](svelte-transition.html#draw)

Animates the stroke of an SVG element, like a snake in a tube. `in` transitions begin with the path invisible and draw the path to the screen over time. `out` transitions start in a visible state and gradually erase the path. `draw` only works with elements that have a `getTotalLength` method, like `<path>` and `<polyline>`.

function draw(
	node: SVGElement & {
		getTotalLength(): number;
	},
	{
		delay,
		speed,
		duration,
		easing
	}?: DrawParams | undefined
): TransitionConfig;

## fade[](svelte-transition.html#fade)

Animates the opacity of an element from 0 to the current opacity for `in` transitions and from the current opacity to 0 for `out` transitions.

function fade(
	node: Element,
	{ delay, duration, easing }?: FadeParams | undefined
): TransitionConfig;

## fly[](svelte-transition.html#fly)

Animates the x and y positions and the opacity of an element. `in` transitions animate from the provided values, passed as parameters to the element’s default values. `out` transitions animate from the element’s default values to the provided values.

function fly(
	node: Element,
	{
		delay,
		duration,
		easing,
		x,
		y,
		opacity
	}?: FlyParams | undefined
): TransitionConfig;

## scale[](svelte-transition.html#scale)

Animates the opacity and scale of an element. `in` transitions animate from the provided values, passed as parameters, to an element’s current (default) values. `out` transitions animate from an element’s default values to the provided values.

function scale(
	node: Element,
	{
		delay,
		duration,
		easing,
		start,
		opacity
	}?: ScaleParams | undefined
): TransitionConfig;

## slide[](svelte-transition.html#slide)

Slides an element in and out.

function slide(
	node: Element,
	{
		delay,
		duration,
		easing,
		axis
	}?: SlideParams | undefined
): TransitionConfig;

## BlurParams[](svelte-transition.html#BlurParams)

interface BlurParams {…}

delay?: number;

duration?: number;

easing?: EasingFunction;

amount?: number | string;

opacity?: number;

## CrossfadeParams[](svelte-transition.html#CrossfadeParams)

interface CrossfadeParams {…}

delay?: number;

duration?: number | ((len: number) => number);

easing?: EasingFunction;

## DrawParams[](svelte-transition.html#DrawParams)

interface DrawParams {…}

delay?: number;

speed?: number;

duration?: number | ((len: number) => number);

easing?: EasingFunction;

## EasingFunction[](svelte-transition.html#EasingFunction)

type EasingFunction = (t: number) => number;

## FadeParams[](svelte-transition.html#FadeParams)

interface FadeParams {…}

delay?: number;

duration?: number;

easing?: EasingFunction;

## FlyParams[](svelte-transition.html#FlyParams)

interface FlyParams {…}

delay?: number;

duration?: number;

easing?: EasingFunction;

x?: number | string;

y?: number | string;

opacity?: number;

## ScaleParams[](svelte-transition.html#ScaleParams)

interface ScaleParams {…}

delay?: number;

duration?: number;

easing?: EasingFunction;

start?: number;

opacity?: number;

## SlideParams[](svelte-transition.html#SlideParams)

interface SlideParams {…}

delay?: number;

duration?: number;

easing?: EasingFunction;

axis?: 'x' | 'y';

## TransitionConfig[](svelte-transition.html#TransitionConfig)

interface TransitionConfig {…}

delay?: number;

duration?: number;

easing?: EasingFunction;

css?: (t: number, u: number) => string;

tick?: (t: number, u: number) => void;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-transition.md)

previous next

[svelte/store](svelte-store.html) [Compiler errors](compiler-errors.html)