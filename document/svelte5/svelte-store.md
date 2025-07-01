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

# svelte/store

### On this page

-   [svelte/store](svelte-store.html)
-   [derived](svelte-store.html#derived)
-   [fromStore](svelte-store.html#fromStore)
-   [get](svelte-store.html#get)
-   [readable](svelte-store.html#readable)
-   [readonly](svelte-store.html#readonly)
-   [toStore](svelte-store.html#toStore)
-   [writable](svelte-store.html#writable)
-   [Readable](svelte-store.html#Readable)
-   [StartStopNotifier](svelte-store.html#StartStopNotifier)
-   [Subscriber](svelte-store.html#Subscriber)
-   [Unsubscriber](svelte-store.html#Unsubscriber)
-   [Updater](svelte-store.html#Updater)
-   [Writable](svelte-store.html#Writable)

import {
	`function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void, initial_value?: T | undefined): Readable<T> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived,
	`function fromStore<V>(store: Writable<V>): {     current: V; } (+1 overload)`fromStore,
	`function get<T>(store: Readable<T>): T`

Get the current value from a store by subscribing and immediately unsubscribing.

get,
	`function readable<T>(value?: T | undefined, start?: StartStopNotifier<T> | undefined): Readable<T>`

Creates a `Readable` store that allows reading by subscription.

@paramvalue initial value

readable,
	`function readonly<T>(store: Readable<T>): Readable<T>`

Takes a store and returns a new one derived from the old one that is readable.

@paramstore - store to make readonly

readonly,
	`function toStore<V>(get: () => V, set: (v: V) => void): Writable<V> (+1 overload)`toStore,
	`function writable<T>(value?: T | undefined, start?: StartStopNotifier<T> | undefined): Writable<T>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable
} from 'svelte/store';

## derived[](svelte-store.html#derived)

Derived value store by synchronizing one or more readable stores and applying an aggregation function over its input values.

function derived<S extends Stores, T>(
	stores: S,
	fn: (
		values: StoresValues<S>,
		set: (value: T) => void,
		update: (fn: Updater<T>) => void
	) => Unsubscriber | void,
	initial_value?: T | undefined
): Readable<T>;

function derived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T,
	initial_value?: T | undefined
): Readable<T>;

## fromStore[](svelte-store.html#fromStore)

function fromStore<V>(store: Writable<V>): {
	current: V;
};

function fromStore<V>(store: Readable<V>): {
	readonly current: V;
};

## get[](svelte-store.html#get)

Get the current value from a store by subscribing and immediately unsubscribing.

function get<T>(store: Readable<T>): T;

## readable[](svelte-store.html#readable)

Creates a `Readable` store that allows reading by subscription.

function readable<T>(
	value?: T | undefined,
	start?: StartStopNotifier<T> | undefined
): Readable<T>;

## readonly[](svelte-store.html#readonly)

Takes a store and returns a new one derived from the old one that is readable.

function readonly<T>(store: Readable<T>): Readable<T>;

## toStore[](svelte-store.html#toStore)

function toStore<V>(
	get: () => V,
	set: (v: V) => void
): Writable<V>;

function toStore<V>(get: () => V): Readable<V>;

## writable[](svelte-store.html#writable)

Create a `Writable` store that allows both updating and reading by subscription.

function writable<T>(
	value?: T | undefined,
	start?: StartStopNotifier<T> | undefined
): Writable<T>;

## Readable[](svelte-store.html#Readable)

Readable interface for subscribing.

interface Readable<T> {…}

subscribe(this: void, run: Subscriber<T>, invalidate?: () => void): Unsubscriber;

-   `run` subscription callback
-   `invalidate` cleanup callback

Subscribe on value changes.

## StartStopNotifier[](svelte-store.html#StartStopNotifier)

Start and stop notification callbacks. This function is called when the first subscriber subscribes.

type StartStopNotifier<T> = (
	set: (value: T) => void,
	update: (fn: Updater<T>) => void
) => void | (() => void);

## Subscriber[](svelte-store.html#Subscriber)

Callback to inform of a value updates.

type Subscriber<T> = (value: T) => void;

## Unsubscriber[](svelte-store.html#Unsubscriber)

Unsubscribes from value updates.

type Unsubscriber = () => void;

## Updater[](svelte-store.html#Updater)

Callback to update a value.

type Updater<T> = (value: T) => T;

## Writable[](svelte-store.html#Writable)

Writable interface for both updating and subscribing.

interface Writable<T> extends Readable<T> {…}

set(this: void, value: T): void;

-   `value` to set

Set value and inform subscribers.

update(this: void, updater: Updater<T>): void;

-   `updater` callback

Update value using callback and inform subscribers.

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-store.md)

previous next

[svelte/server](svelte-server.html) [svelte/transition](svelte-transition.html)