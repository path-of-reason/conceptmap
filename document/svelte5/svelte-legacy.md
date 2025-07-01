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

# svelte/legacy

### On this page

-   [svelte/legacy](svelte-legacy.html)
-   [asClassComponent](svelte-legacy.html#asClassComponent)
-   [createBubbler](svelte-legacy.html#createBubbler)
-   [createClassComponent](svelte-legacy.html#createClassComponent)
-   [handlers](svelte-legacy.html#handlers)
-   [nonpassive](svelte-legacy.html#nonpassive)
-   [once](svelte-legacy.html#once)
-   [passive](svelte-legacy.html#passive)
-   [preventDefault](svelte-legacy.html#preventDefault)
-   [run](svelte-legacy.html#run)
-   [self](svelte-legacy.html#self)
-   [stopImmediatePropagation](svelte-legacy.html#stopImmediatePropagation)
-   [stopPropagation](svelte-legacy.html#stopPropagation)
-   [trusted](svelte-legacy.html#trusted)
-   [LegacyComponentType](svelte-legacy.html#LegacyComponentType)

This module provides various functions for use during the migration, since some features can’t be replaced one to one with new features. All imports are marked as deprecated and should be migrated away from over time.

import {
	`function asClassComponent<Props extends Record<string, any>, Exports extends Record<string, any>, Events extends Record<string, any>, Slots extends Record<string, any>>(component: SvelteComponent<Props, Events, Slots> | Component<Props>): ComponentType<SvelteComponent<Props, Events, Slots> & Exports>`

Takes the component function and returns a Svelte 4 compatible component constructor.

@deprecatedUse this only as a temporary solution to migrate your imperative component code to Svelte 5.

asClassComponent,
	`function createBubbler(): (type: string) => (event: Event) => boolean`

Function to create a `bubble` function that mimic the behavior of `on:click` without handler available in svelte 4.

@deprecatedUse this only as a temporary solution to migrate your automatically delegated events in Svelte 5.

createBubbler,
	`function createClassComponent<Props extends Record<string, any>, Exports extends Record<string, any>, Events extends Record<string, any>, Slots extends Record<string, any>>(options: ComponentConstructorOptions<Props> & {     component: ComponentType<SvelteComponent<Props, Events, Slots>> | Component<Props>; }): SvelteComponent<Props, Events, Slots> & Exports`

Takes the same options as a Svelte 4 component and the component function and returns a Svelte 4 compatible component.

@deprecatedUse this only as a temporary solution to migrate your imperative component code to Svelte 5.

createClassComponent,
	`function handlers(...handlers: EventListener[]): EventListener`

Function to mimic the multiple listeners available in svelte 4

@deprecated

handlers,
	`function nonpassive(node: HTMLElement, [event, handler]: [event: string, handler: () => EventListener]): void`

Substitute for the `nonpassive` event modifier, implemented as an action

@deprecated

nonpassive,
	`function once(fn: (event: Event, ...args: Array<unknown>) => void): (event: Event, ...args: unknown[]) => void`

Substitute for the `once` event modifier

@deprecated

once,
	`function passive(node: HTMLElement, [event, handler]: [event: string, handler: () => EventListener]): void`

Substitute for the `passive` event modifier, implemented as an action

@deprecated

passive,
	`function preventDefault(fn: (event: Event, ...args: Array<unknown>) => void): (event: Event, ...args: unknown[]) => void`

Substitute for the `preventDefault` event modifier

@deprecated

preventDefault,
	`function run(fn: () => void | (() => void)): void`

Runs the given function once immediately on the server, and works like `$effect.pre` on the client.

@deprecatedUse this only as a temporary solution to migrate your component code to Svelte 5.

run,
	`function self(fn: (event: Event, ...args: Array<unknown>) => void): (event: Event, ...args: unknown[]) => void`

Substitute for the `self` event modifier

@deprecated

self,
	`function stopImmediatePropagation(fn: (event: Event, ...args: Array<unknown>) => void): (event: Event, ...args: unknown[]) => void`

Substitute for the `stopImmediatePropagation` event modifier

@deprecated

stopImmediatePropagation,
	`function stopPropagation(fn: (event: Event, ...args: Array<unknown>) => void): (event: Event, ...args: unknown[]) => void`

Substitute for the `stopPropagation` event modifier

@deprecated

stopPropagation,
	`function trusted(fn: (event: Event, ...args: Array<unknown>) => void): (event: Event, ...args: unknown[]) => void`

Substitute for the `trusted` event modifier

@deprecated

trusted
} from 'svelte/legacy';

## asClassComponent[](svelte-legacy.html#asClassComponent)

> Use this only as a temporary solution to migrate your imperative component code to Svelte 5.

Takes the component function and returns a Svelte 4 compatible component constructor.

function asClassComponent<
	Props extends Record<string, any>,
	Exports extends Record<string, any>,
	Events extends Record<string, any>,
	Slots extends Record<string, any>
>(
	component:
		| SvelteComponent<Props, Events, Slots>
		| Component<Props>
): ComponentType<
	SvelteComponent<Props, Events, Slots> & Exports
>;

## createBubbler[](svelte-legacy.html#createBubbler)

> Use this only as a temporary solution to migrate your automatically delegated events in Svelte 5.

Function to create a `bubble` function that mimic the behavior of `on:click` without handler available in svelte 4.

function createBubbler(): (
	type: string
) => (event: Event) => boolean;

## createClassComponent[](svelte-legacy.html#createClassComponent)

> Use this only as a temporary solution to migrate your imperative component code to Svelte 5.

Takes the same options as a Svelte 4 component and the component function and returns a Svelte 4 compatible component.

function createClassComponent<
	Props extends Record<string, any>,
	Exports extends Record<string, any>,
	Events extends Record<string, any>,
	Slots extends Record<string, any>
>(
	options: ComponentConstructorOptions<Props> & {
		component:
			| ComponentType<SvelteComponent<Props, Events, Slots>>
			| Component<Props>;
	}
): SvelteComponent<Props, Events, Slots> & Exports;

## handlers[](svelte-legacy.html#handlers)

Function to mimic the multiple listeners available in svelte 4

function handlers(
	...handlers: EventListener[]
): EventListener;

## nonpassive[](svelte-legacy.html#nonpassive)

Substitute for the `nonpassive` event modifier, implemented as an action

function nonpassive(
	node: HTMLElement,
	[event, handler]: [
		event: string,
		handler: () => EventListener
	]
): void;

## once[](svelte-legacy.html#once)

Substitute for the `once` event modifier

function once(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;

## passive[](svelte-legacy.html#passive)

Substitute for the `passive` event modifier, implemented as an action

function passive(
	node: HTMLElement,
	[event, handler]: [
		event: string,
		handler: () => EventListener
	]
): void;

## preventDefault[](svelte-legacy.html#preventDefault)

Substitute for the `preventDefault` event modifier

function preventDefault(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;

## run[](svelte-legacy.html#run)

> Use this only as a temporary solution to migrate your component code to Svelte 5.

Runs the given function once immediately on the server, and works like `$effect.pre` on the client.

function run(fn: () => void | (() => void)): void;

## self[](svelte-legacy.html#self)

Substitute for the `self` event modifier

function self(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;

## stopImmediatePropagation[](svelte-legacy.html#stopImmediatePropagation)

Substitute for the `stopImmediatePropagation` event modifier

function stopImmediatePropagation(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;

## stopPropagation[](svelte-legacy.html#stopPropagation)

Substitute for the `stopPropagation` event modifier

function stopPropagation(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;

## trusted[](svelte-legacy.html#trusted)

Substitute for the `trusted` event modifier

function trusted(
	fn: (event: Event, ...args: Array<unknown>) => void
): (event: Event, ...args: unknown[]) => void;

## LegacyComponentType[](svelte-legacy.html#LegacyComponentType)

Support using the component as both a class and function during the transition period

type LegacyComponentType = {
	new (o: ComponentConstructorOptions): SvelteComponent;
	(
		...args: Parameters<Component<Record<string, any>>>
	): ReturnType<
		Component<Record<string, any>, Record<string, any>>
	>;
};

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-legacy.md)

previous next

[svelte/events](svelte-events.html) [svelte/motion](svelte-motion.html)