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

# svelte

### On this page

-   [svelte](svelte.html)
-   [SvelteComponent](svelte.html#SvelteComponent)
-   [SvelteComponentTyped](svelte.html#SvelteComponentTyped)
-   [afterUpdate](svelte.html#afterUpdate)
-   [beforeUpdate](svelte.html#beforeUpdate)
-   [createEventDispatcher](svelte.html#createEventDispatcher)
-   [createRawSnippet](svelte.html#createRawSnippet)
-   [flushSync](svelte.html#flushSync)
-   [getAllContexts](svelte.html#getAllContexts)
-   [getContext](svelte.html#getContext)
-   [hasContext](svelte.html#hasContext)
-   [hydrate](svelte.html#hydrate)
-   [mount](svelte.html#mount)
-   [onDestroy](svelte.html#onDestroy)
-   [onMount](svelte.html#onMount)
-   [setContext](svelte.html#setContext)
-   [tick](svelte.html#tick)
-   [unmount](svelte.html#unmount)
-   [untrack](svelte.html#untrack)
-   [Component](svelte.html#Component)
-   [ComponentConstructorOptions](svelte.html#ComponentConstructorOptions)
-   [ComponentEvents](svelte.html#ComponentEvents)
-   [ComponentInternals](svelte.html#ComponentInternals)
-   [ComponentProps](svelte.html#ComponentProps)
-   [ComponentType](svelte.html#ComponentType)
-   [EventDispatcher](svelte.html#EventDispatcher)
-   [MountOptions](svelte.html#MountOptions)
-   [Snippet](svelte.html#Snippet)

import {
	`class SvelteComponent<Props extends Record<string, any> = Record<string, any>, Events extends Record<string, any> = any, Slots extends Record<string, any> = any>`

This was the base class for Svelte components in Svelte 4. Svelte 5+ components
are completely different under the hood. For typing, use `Component` instead.
To instantiate components, use `mount` instead.
See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

SvelteComponent,
	`class SvelteComponentTyped<Props extends Record<string, any> = Record<string, any>, Events extends Record<string, any> = any, Slots extends Record<string, any> = any>`

@deprecatedUse `Component` instead. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more information.

SvelteComponentTyped,
	`function afterUpdate(fn: () => void): void`

Schedules a callback to run immediately after the component has been updated.

The first time the callback runs will be after the initial `onMount`.

In runes mode use `$effect` instead.

@deprecatedUse [`$effect`]($effect.html) instead

afterUpdate,
	`function beforeUpdate(fn: () => void): void`

Schedules a callback to run immediately before the component is updated after any state change.

The first time the callback runs will be before the initial `onMount`.

In runes mode use `$effect.pre` instead.

@deprecatedUse [`$effect.pre`]($effect.html#$effect.pre) instead

beforeUpdate,
	`function createEventDispatcher<EventMap extends Record<string, any> = any>(): EventDispatcher<EventMap>`

Creates an event dispatcher that can be used to dispatch [component events](legacy-on.html#Component-events).
Event dispatchers are functions that can take two arguments: `name` and `detail`.

Component events created with `createEventDispatcher` create a
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
property and can contain any type of data.

The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:

const dispatch = createEventDispatcher&#x3C;{
 loaded: never; // does not take a detail argument
 change: string; // takes a detail argument of type string, which is required
 optional: number | null; // takes an optional detail argument of type number
}>();

@deprecatedUse callback props and/or the `$host()` rune instead — see [migration guide](v5-migration-guide.html#Event-changes-Component-events)

createEventDispatcher,
	`function createRawSnippet<Params extends unknown[]>(fn: (...params: Getters<Params>) => {     render: () => string;     setup?: (element: Element) => void | (() => void); }): Snippet<Params>`

Create a snippet programmatically

createRawSnippet,
	`function flushSync<T = void>(fn?: (() => T) | undefined): T`

Synchronously flush any pending updates.
Returns void if no callback is provided, otherwise returns the result of calling the callback.

flushSync,
	`function getAllContexts<T extends Map<any, any> = Map<any, any>>(): T`

Retrieves the whole context map that belongs to the closest parent component.
Must be called during component initialisation. Useful, for example, if you
programmatically create a component and want to pass the existing context to it.

getAllContexts,
	`function getContext<T>(key: any): T`

Retrieves the context that belongs to the closest parent component with the specified `key`.
Must be called during component initialisation.

getContext,
	`function hasContext(key: any): boolean`

Checks whether a given `key` has been set in the context of a parent component.
Must be called during component initialisation.

hasContext,
	`function hydrate<Props extends Record<string, any>, Exports extends Record<string, any>>(component: ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>, options: {} extends Props ? {     target: Document | Element | ShadowRoot;     props?: Props;     events?: Record<string, (e: any) => any>;     context?: Map<any, any>;     intro?: boolean;     recover?: boolean; } : {     target: Document | Element | ShadowRoot;     props: Props;     events?: Record<string, (e: any) => any>;     context?: Map<any, any>;     intro?: boolean;     recover?: boolean; }): Exports`

Hydrates a component on the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component

hydrate,
	`function mount<Props extends Record<string, any>, Exports extends Record<string, any>>(component: ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>, options: MountOptions<Props>): Exports`

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
Transitions will play during the initial render unless the `intro` option is set to `false`.

mount,
	`function onDestroy(fn: () => any): void`

Schedules a callback to run immediately before the component is unmounted.

Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
only one that runs inside a server-side component.

onDestroy,
	`function onMount<T>(fn: () => NotFunction<T> | Promise<NotFunction<T>> | (() => any)): void`

`onMount`, like [`$effect`]($effect.html), schedules a function to run as soon as the component has been mounted to the DOM.
Unlike `$effect`, the provided function only runs once.

It must be called during the component’s initialisation (but doesn’t need to live *inside* the component;
it can be called from an external module). If a function is returned *synchronously* from `onMount`,
it will be called when the component is unmounted.

`onMount` functions do not run during [server-side rendering](svelte-server.html#render).

onMount,
	`function setContext<T>(key: any, context: T): T`

Associates an arbitrary `context` object with the current component and the specified `key`
and returns that object. The context is then available to children of the component
(including slotted content) with `getContext`.

Like lifecycle functions, this must be called during component initialisation.

setContext,
	`function tick(): Promise<void>`

Returns a promise that resolves once any pending state changes have been applied.

tick,
	`function unmount(component: Record<string, any>, options?: {     outro?: boolean; } | undefined): Promise<void>`

Unmounts a component that was previously mounted using `mount` or `hydrate`.

Since 5.13.0, if `options.outro` is `true`, [transitions](transition.html) will play before the component is removed from the DOM.

Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).

import { mount, unmount } from 'svelte';
import App from './App.svelte';
const app = mount(App, { target: document.body });
// later...
unmount(app, { outro: true });

unmount,
	`function untrack<T>(fn: () => T): T`

When used inside a [`$derived`]($derived.html) or [`$effect`]($effect.html),
any state read inside `fn` will not be treated as a dependency.

$effect(() => {
  // this will run when `data` changes, but not when `time` changes
  save(data, {
	timestamp: untrack(() => time)
  });
});

untrack
} from 'svelte';

## SvelteComponent[](svelte.html#SvelteComponent)

This was the base class for Svelte components in Svelte 4. Svelte 5+ components are completely different under the hood. For typing, use `Component` instead. To instantiate components, use `mount` instead. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

class SvelteComponent<
	Props extends Record<string, any> = Record<string, any>,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> {…}

static element?: typeof HTMLElement;

The custom element version of the component. Only present if compiled with the `customElement` compiler option

[prop: string]: any;

constructor(options: ComponentConstructorOptions<Properties<Props, Slots>>);

-   deprecated This constructor only exists when using the `asClassComponent` compatibility helper, which is a stop-gap solution. Migrate towards using `mount` instead. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

$destroy(): void;

-   deprecated This method only exists when using one of the legacy compatibility helpers, which is a stop-gap solution. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

$on<K extends Extract<keyof Events, string>>(
	type: K,
	callback: (e: Events[K]) => void
): () => void;

-   deprecated This method only exists when using one of the legacy compatibility helpers, which is a stop-gap solution. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

$set(props: Partial<Props>): void;

-   deprecated This method only exists when using one of the legacy compatibility helpers, which is a stop-gap solution. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

## SvelteComponentTyped[](svelte.html#SvelteComponentTyped)

> Use `Component` instead. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more information.

class SvelteComponentTyped<
	Props extends Record<string, any> = Record<string, any>,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> extends SvelteComponent<Props, Events, Slots> {}

## afterUpdate[](svelte.html#afterUpdate)

> Use [`$effect`]($effect.html) instead

Schedules a callback to run immediately after the component has been updated.

The first time the callback runs will be after the initial `onMount`.

In runes mode use `$effect` instead.

function afterUpdate(fn: () => void): void;

## beforeUpdate[](svelte.html#beforeUpdate)

> Use [`$effect.pre`]($effect.html#$effect.pre) instead

Schedules a callback to run immediately before the component is updated after any state change.

The first time the callback runs will be before the initial `onMount`.

In runes mode use `$effect.pre` instead.

function beforeUpdate(fn: () => void): void;

## createEventDispatcher[](svelte.html#createEventDispatcher)

> Use callback props and/or the `$host()` rune instead — see [migration guide](v5-migration-guide.html#Event-changes-Component-events)

Creates an event dispatcher that can be used to dispatch [component events](legacy-on.html#Component-events). Event dispatchers are functions that can take two arguments: `name` and `detail`.

Component events created with `createEventDispatcher` create a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent). These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture). The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) property and can contain any type of data.

The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:

const `const dispatch: any`dispatch = createEventDispatcher<{
 `loaded: never`loaded: never; // does not take a detail argument
 `change: string`change: string; // takes a detail argument of type string, which is required
 `optional: number | null`optional: number | null; // takes an optional detail argument of type number
}>();

function createEventDispatcher<
	EventMap extends Record<string, any> = any
>(): EventDispatcher<EventMap>;

## createRawSnippet[](svelte.html#createRawSnippet)

Create a snippet programmatically

function createRawSnippet<Params extends unknown[]>(
	fn: (...params: Getters<Params>) => {
		render: () => string;
		setup?: (element: Element) => void | (() => void);
	}
): Snippet<Params>;

## flushSync[](svelte.html#flushSync)

Synchronously flush any pending updates. Returns void if no callback is provided, otherwise returns the result of calling the callback.

function flushSync<T = void>(fn?: (() => T) | undefined): T;

## getAllContexts[](svelte.html#getAllContexts)

Retrieves the whole context map that belongs to the closest parent component. Must be called during component initialisation. Useful, for example, if you programmatically create a component and want to pass the existing context to it.

function getAllContexts<
	T extends Map<any, any> = Map<any, any>
>(): T;

## getContext[](svelte.html#getContext)

Retrieves the context that belongs to the closest parent component with the specified `key`. Must be called during component initialisation.

function getContext<T>(key: any): T;

## hasContext[](svelte.html#hasContext)

Checks whether a given `key` has been set in the context of a parent component. Must be called during component initialisation.

function hasContext(key: any): boolean;

## hydrate[](svelte.html#hydrate)

Hydrates a component on the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component

function hydrate<
	Props extends Record<string, any>,
	Exports extends Record<string, any>
>(
	component:
		| ComponentType<SvelteComponent<Props>>
		| Component<Props, Exports, any>,
	options: {} extends Props
		? {
				target: Document | Element | ShadowRoot;
				props?: Props;
				events?: Record<string, (e: any) => any>;
				context?: Map<any, any>;
				intro?: boolean;
				recover?: boolean;
			}
		: {
				target: Document | Element | ShadowRoot;
				props: Props;
				events?: Record<string, (e: any) => any>;
				context?: Map<any, any>;
				intro?: boolean;
				recover?: boolean;
			}
): Exports;

## mount[](svelte.html#mount)

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component. Transitions will play during the initial render unless the `intro` option is set to `false`.

function mount<
	Props extends Record<string, any>,
	Exports extends Record<string, any>
>(
	component:
		| ComponentType<SvelteComponent<Props>>
		| Component<Props, Exports, any>,
	options: MountOptions<Props>
): Exports;

## onDestroy[](svelte.html#onDestroy)

Schedules a callback to run immediately before the component is unmounted.

Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the only one that runs inside a server-side component.

function onDestroy(fn: () => any): void;

## onMount[](svelte.html#onMount)

`onMount`, like [`$effect`]($effect.html), schedules a function to run as soon as the component has been mounted to the DOM. Unlike `$effect`, the provided function only runs once.

It must be called during the component’s initialisation (but doesn’t need to live *inside* the component; it can be called from an external module). If a function is returned *synchronously* from `onMount`, it will be called when the component is unmounted.

`onMount` functions do not run during [server-side rendering](svelte-server.html#render).

function onMount<T>(
	fn: () =>
		| NotFunction<T>
		| Promise<NotFunction<T>>
		| (() => any)
): void;

## setContext[](svelte.html#setContext)

Associates an arbitrary `context` object with the current component and the specified `key` and returns that object. The context is then available to children of the component (including slotted content) with `getContext`.

Like lifecycle functions, this must be called during component initialisation.

function setContext<T>(key: any, context: T): T;

## tick[](svelte.html#tick)

Returns a promise that resolves once any pending state changes have been applied.

function tick(): Promise<void>;

## unmount[](svelte.html#unmount)

Unmounts a component that was previously mounted using `mount` or `hydrate`.

Since 5.13.0, if `options.outro` is `true`, [transitions](transition.html) will play before the component is removed from the DOM.

Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).

import { `function mount<Props extends Record<string, any>, Exports extends Record<string, any>>(component: ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>, options: MountOptions<Props>): Exports`

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
Transitions will play during the initial render unless the `intro` option is set to `false`.

mount, `function unmount(component: Record<string, any>, options?: {     outro?: boolean; } | undefined): Promise<void>`

Unmounts a component that was previously mounted using `mount` or `hydrate`.

Since 5.13.0, if `options.outro` is `true`, [transitions](transition.html) will play before the component is removed from the DOM.

Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).

import { mount, unmount } from 'svelte';
import App from './App.svelte';
const app = mount(App, { target: document.body });
// later...
unmount(app, { outro: true });

unmount } from 'svelte';
import `type App = SvelteComponent<Record<string, any>, any, any> const App: LegacyComponentType`App from './App.svelte';
const `const app: {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<string, any>`app = `mount<Record<string, any>, {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<...>>(component: ComponentType<...> | Component<...>, options: MountOptions<...>): {     ...; } & Record<...>`

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
Transitions will play during the initial render unless the `intro` option is set to `false`.

mount(`const App: LegacyComponentType`App, { `target: Document | Element | ShadowRoot`

Target element where the component will be mounted.

target: `var document: Document`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/document)

document.`Document.body: HTMLElement`

Specifies the beginning and end of the document body.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/body)

body });
// later...
`function unmount(component: Record<string, any>, options?: {     outro?: boolean; } | undefined): Promise<void>`

Unmounts a component that was previously mounted using `mount` or `hydrate`.

Since 5.13.0, if `options.outro` is `true`, [transitions](transition.html) will play before the component is removed from the DOM.

Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).

import { mount, unmount } from 'svelte';
import App from './App.svelte';
const app = mount(App, { target: document.body });
// later...
unmount(app, { outro: true });

unmount(`const app: {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<string, any>`app, { `outro?: boolean | undefined`outro: true });

function unmount(
	component: Record<string, any>,
	options?:
		| {
				outro?: boolean;
		  }
		| undefined
): Promise<void>;

## untrack[](svelte.html#untrack)

When used inside a [`$derived`]($derived.html) or [`$effect`]($effect.html), any state read inside `fn` will not be treated as a dependency.

`function $effect(fn: () => void | (() => void)): void namespace $effect`

Runs code when a component is mounted to the DOM, and then whenever its dependencies change, i.e. `$state` or `$derived` values.
The timing of the execution is after the DOM has been updated.

Example:

$effect(() => console.log('The count is now ' + count));

If you return a function from the effect, it will be called right before the effect is run again, or when the component is unmounted.

Does not run during server side rendering.

[https://svelte.dev/docs/svelte/$effect]($effect.html)

@paramfn The function to execute

$effect(() => {
	// this will run when `data` changes, but not when `time` changes
	save(data, {
		`timestamp: any`timestamp: untrack(() => time)
	});
});

function untrack<T>(fn: () => T): T;

## Component[](svelte.html#Component)

Can be used to create strongly typed Svelte components.

#### Example:[](svelte.html#Component-Example:)

You have component library on npm called `component-library`, from which you export a component called `MyComponent`. For Svelte+TypeScript users, you want to provide typings. Therefore you create a `index.d.ts`:

import type { `interface Component<Props extends Record<string, any> = {}, Exports extends Record<string, any> = {}, Bindings extends keyof Props | "" = string>`

Can be used to create strongly typed Svelte components.

#### Example:[](svelte.html#Example:)

You have component library on npm called `component-library`, from which
you export a component called `MyComponent`. For Svelte+TypeScript users,
you want to provide typings. Therefore you create a `index.d.ts`:

import type { Component } from 'svelte';
export declare const MyComponent: Component&#x3C;{ foo: string }> {}

Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:

&#x3C;script lang="ts">
	import { MyComponent } from "component-library";
&#x3C;/script>
&#x3C;MyComponent foo={'bar'} />

Component } from 'svelte';
export declare const `const MyComponent: Component<{     foo: string; }, {}, string>`MyComponent: `interface Component<Props extends Record<string, any> = {}, Exports extends Record<string, any> = {}, Bindings extends keyof Props | "" = string>`

Can be used to create strongly typed Svelte components.

#### Example:[](svelte.html#Example:)

You have component library on npm called `component-library`, from which
you export a component called `MyComponent`. For Svelte+TypeScript users,
you want to provide typings. Therefore you create a `index.d.ts`:

import type { Component } from 'svelte';
export declare const MyComponent: Component&#x3C;{ foo: string }> {}

Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:

&#x3C;script lang="ts">
	import { MyComponent } from "component-library";
&#x3C;/script>
&#x3C;MyComponent foo={'bar'} />

Component<{ `foo: string`foo: string }> {}

Typing this makes it possible for IDEs like VS Code with the Svelte extension to provide intellisense and to use the component like this in a Svelte file with TypeScript:

<script lang="ts">
	import { MyComponent } from "component-library";
</script>
<MyComponent foo={'bar'} />

interface Component<
	Props extends Record<string, any> = {},
	Exports extends Record<string, any> = {},
	Bindings extends keyof Props | '' = string
> {…}

(
	this: void,
	internals: ComponentInternals,
	props: Props
): {
	/**
	 * @deprecated This method only exists when using one of the legacy compatibility helpers, which
	 * is a stop-gap solution. See [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)
	 * for more info.
	 */
	$on?(type: string, callback: (e: any) => void): () => void;
	/**
	 * @deprecated This method only exists when using one of the legacy compatibility helpers, which
	 * is a stop-gap solution. See [migration guide](https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes)
	 * for more info.
	 */
	$set?(props: Partial<Props>): void;
} & Exports;

-   `internal` An internal object used by Svelte. Do not use or modify.
-   `props` The props passed to the component.

element?: typeof HTMLElement;

The custom element version of the component. Only present if compiled with the `customElement` compiler option

## ComponentConstructorOptions[](svelte.html#ComponentConstructorOptions)

> In Svelte 4, components are classes. In Svelte 5, they are functions. Use `mount` instead to instantiate components. See [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more info.

interface ComponentConstructorOptions<
	Props extends Record<string, any> = Record<string, any>
> {…}

target: Element | Document | ShadowRoot;

anchor?: Element;

props?: Props;

context?: Map<any, any>;

hydrate?: boolean;

intro?: boolean;

recover?: boolean;

sync?: boolean;

idPrefix?: string;

$$inline?: boolean;

## ComponentEvents[](svelte.html#ComponentEvents)

> The new `Component` type does not have a dedicated Events type. Use `ComponentProps` instead.

type ComponentEvents<Comp extends SvelteComponent> =
	Comp extends SvelteComponent<any, infer Events>
		? Events
		: never;

## ComponentInternals[](svelte.html#ComponentInternals)

Internal implementation details that vary between environments

type ComponentInternals = Branded<{}, 'ComponentInternals'>;

## ComponentProps[](svelte.html#ComponentProps)

Convenience type to get the props the given component expects.

Example: Ensure a variable contains the props expected by `MyComponent`:

import type { `type ComponentProps<Comp extends SvelteComponent | Component<any, any>> = Comp extends SvelteComponent<infer Props extends Record<string, any>, any, any> ? Props : Comp extends Component<infer Props extends Record<...>, any, string> ? Props : never`

Convenience type to get the props the given component expects.

Example: Ensure a variable contains the props expected by `MyComponent`:

import type { ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
// Errors if these aren't the correct props expected by MyComponent.
const props: ComponentProps&#x3C;typeof MyComponent> = { foo: 'bar' };

>  In Svelte 4, you would do `ComponentProps&#x3C;MyComponent>` because `MyComponent` was a class.

Example: A generic function that accepts some component and infers the type of its props:

import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
function withProps&#x3C;TComponent extends Component&#x3C;any>>(
	component: TComponent,
	props: ComponentProps&#x3C;TComponent>
) {};
// Errors if the second argument is not the correct props expected by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });

ComponentProps } from 'svelte';
import `type MyComponent = SvelteComponent<Record<string, any>, any, any> const MyComponent: LegacyComponentType`MyComponent from './MyComponent.svelte';
// Errors if these aren't the correct props expected by MyComponent.
const `const props: Record<string, any>`props: `type ComponentProps<Comp extends SvelteComponent | Component<any, any>> = Comp extends SvelteComponent<infer Props extends Record<string, any>, any, any> ? Props : Comp extends Component<infer Props extends Record<...>, any, string> ? Props : never`

Convenience type to get the props the given component expects.

Example: Ensure a variable contains the props expected by `MyComponent`:

import type { ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
// Errors if these aren't the correct props expected by MyComponent.
const props: ComponentProps&#x3C;typeof MyComponent> = { foo: 'bar' };

>  In Svelte 4, you would do `ComponentProps&#x3C;MyComponent>` because `MyComponent` was a class.

Example: A generic function that accepts some component and infers the type of its props:

import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
function withProps&#x3C;TComponent extends Component&#x3C;any>>(
	component: TComponent,
	props: ComponentProps&#x3C;TComponent>
) {};
// Errors if the second argument is not the correct props expected by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });

ComponentProps<typeof `const MyComponent: LegacyComponentType`MyComponent> = { `foo: string`foo: 'bar' };

> In Svelte 4, you would do `ComponentProps<MyComponent>` because `MyComponent` was a class.

Example: A generic function that accepts some component and infers the type of its props:

import type { `interface Component<Props extends Record<string, any> = {}, Exports extends Record<string, any> = {}, Bindings extends keyof Props | "" = string>`

Can be used to create strongly typed Svelte components.

#### Example:[](svelte.html#Example:)

You have component library on npm called `component-library`, from which
you export a component called `MyComponent`. For Svelte+TypeScript users,
you want to provide typings. Therefore you create a `index.d.ts`:

import type { Component } from 'svelte';
export declare const MyComponent: Component&#x3C;{ foo: string }> {}

Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:

&#x3C;script lang="ts">
	import { MyComponent } from "component-library";
&#x3C;/script>
&#x3C;MyComponent foo={'bar'} />

Component, `type ComponentProps<Comp extends SvelteComponent | Component<any, any>> = Comp extends SvelteComponent<infer Props extends Record<string, any>, any, any> ? Props : Comp extends Component<infer Props extends Record<...>, any, string> ? Props : never`

Convenience type to get the props the given component expects.

Example: Ensure a variable contains the props expected by `MyComponent`:

import type { ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
// Errors if these aren't the correct props expected by MyComponent.
const props: ComponentProps&#x3C;typeof MyComponent> = { foo: 'bar' };

>  In Svelte 4, you would do `ComponentProps&#x3C;MyComponent>` because `MyComponent` was a class.

Example: A generic function that accepts some component and infers the type of its props:

import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
function withProps&#x3C;TComponent extends Component&#x3C;any>>(
	component: TComponent,
	props: ComponentProps&#x3C;TComponent>
) {};
// Errors if the second argument is not the correct props expected by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });

ComponentProps } from 'svelte';
import `type MyComponent = SvelteComponent<Record<string, any>, any, any> const MyComponent: LegacyComponentType`MyComponent from './MyComponent.svelte';
function `function withProps<TComponent extends Component<any>>(component: TComponent, props: ComponentProps<TComponent>): void`withProps<`function (type parameter) TComponent in withProps<TComponent extends Component<any>>(component: TComponent, props: ComponentProps<TComponent>): void`TComponent extends `interface Component<Props extends Record<string, any> = {}, Exports extends Record<string, any> = {}, Bindings extends keyof Props | "" = string>`

Can be used to create strongly typed Svelte components.

#### Example:[](svelte.html#Example:)

You have component library on npm called `component-library`, from which
you export a component called `MyComponent`. For Svelte+TypeScript users,
you want to provide typings. Therefore you create a `index.d.ts`:

import type { Component } from 'svelte';
export declare const MyComponent: Component&#x3C;{ foo: string }> {}

Typing this makes it possible for IDEs like VS Code with the Svelte extension
to provide intellisense and to use the component like this in a Svelte file
with TypeScript:

&#x3C;script lang="ts">
	import { MyComponent } from "component-library";
&#x3C;/script>
&#x3C;MyComponent foo={'bar'} />

Component<any>>(
	`component: TComponent extends Component<any>`component: `function (type parameter) TComponent in withProps<TComponent extends Component<any>>(component: TComponent, props: ComponentProps<TComponent>): void`TComponent,
	`props: ComponentProps<TComponent>`props: `type ComponentProps<Comp extends SvelteComponent | Component<any, any>> = Comp extends SvelteComponent<infer Props extends Record<string, any>, any, any> ? Props : Comp extends Component<infer Props extends Record<...>, any, string> ? Props : never`

Convenience type to get the props the given component expects.

Example: Ensure a variable contains the props expected by `MyComponent`:

import type { ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
// Errors if these aren't the correct props expected by MyComponent.
const props: ComponentProps&#x3C;typeof MyComponent> = { foo: 'bar' };

>  In Svelte 4, you would do `ComponentProps&#x3C;MyComponent>` because `MyComponent` was a class.

Example: A generic function that accepts some component and infers the type of its props:

import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';
function withProps&#x3C;TComponent extends Component&#x3C;any>>(
	component: TComponent,
	props: ComponentProps&#x3C;TComponent>
) {};
// Errors if the second argument is not the correct props expected by the component in the first argument.
withProps(MyComponent, { foo: 'bar' });

ComponentProps<`function (type parameter) TComponent in withProps<TComponent extends Component<any>>(component: TComponent, props: ComponentProps<TComponent>): void`TComponent>
) {};
// Errors if the second argument is not the correct props expected by the component in the first argument.
`function withProps<LegacyComponentType>(component: LegacyComponentType, props: Record<string, any>): void`withProps(`const MyComponent: LegacyComponentType`MyComponent, { `foo: string`foo: 'bar' });

type ComponentProps<
	Comp extends SvelteComponent | Component<any, any>
> =
	Comp extends SvelteComponent<infer Props>
		? Props
		: Comp extends Component<infer Props, any>
			? Props
			: never;

## ComponentType[](svelte.html#ComponentType)

> This type is obsolete when working with the new `Component` type.

type ComponentType<
	Comp extends SvelteComponent = SvelteComponent
> = (new (
	options: ComponentConstructorOptions<
		Comp extends SvelteComponent<infer Props>
			? Props
			: Record<string, any>
	>
) => Comp) & {
	/** The custom element version of the component. Only present if compiled with the `customElement` compiler option */
	element?: typeof HTMLElement;
};

## EventDispatcher[](svelte.html#EventDispatcher)

interface EventDispatcher<
	EventMap extends Record<string, any>
> {…}

<Type extends keyof EventMap>(
	...args: null extends EventMap[Type]
		? [type: Type, parameter?: EventMap[Type] | null | undefined, options?: DispatchOptions]
		: undefined extends EventMap[Type]
			? [type: Type, parameter?: EventMap[Type] | null | undefined, options?: DispatchOptions]
			: [type: Type, parameter: EventMap[Type], options?: DispatchOptions]
): boolean;

## MountOptions[](svelte.html#MountOptions)

Defines the options accepted by the `mount()` function.

type MountOptions<
	Props extends Record<string, any> = Record<string, any>
> = {
	/**
	 * Target element where the component will be mounted.
	 */
	target: Document | Element | ShadowRoot;
	/**
	 * Optional node inside `target`. When specified, it is used to render the component immediately before it.
	 */
	anchor?: Node;
	/**
	 * Allows the specification of events.
	 * @deprecated Use callback props instead.
	 */
	events?: Record<string, (e: any) => any>;
	/**
	 * Can be accessed via `getContext()` at the component level.
	 */
	context?: Map<any, any>;
	/**
	 * Whether or not to play transitions on initial render.
	 * @default true
	 */
	intro?: boolean;
} & ({} extends Props
	? {
			/**
			 * Component properties.
			 */
			props?: Props;
		}
	: {
			/**
			 * Component properties.
			 */
			props: Props;
		});

## Snippet[](svelte.html#Snippet)

The type of a `#snippet` block. You can use it to (for example) express that your component expects a snippet of a certain type:

let { `let banner: Snippet<[{     text: string; }]>`banner }: { `banner: Snippet<[{     text: string; }]>`banner: `type Snippet = /*unresolved*/ any`Snippet<[{ `text: string`text: string }]> } = `function $props(): any namespace $props`

Declares the props that a component accepts. Example:

let { optionalProp = 42, requiredProp, bindableProp = $bindable() }: { optionalProp?: number; requiredProps: string; bindableProp: boolean } = $props();

[https://svelte.dev/docs/svelte/$props]($props.html)

$props();

You can only call a snippet through the `{@render ...}` tag.

See the [snippet documentation](snippet.html) for more info.

interface Snippet<Parameters extends unknown[] = []> {…}

(
	this: void,
	// this conditional allows tuples but not arrays. Arrays would indicate a
	// rest parameter type, which is not supported. If rest parameters are added
	// in the future, the condition can be removed.
	...args: number extends Parameters['length'] ? never : Parameters
): {
	'{@render ...} must be called with a Snippet': "import type { Snippet } from 'svelte'";
} & typeof SnippetReturn;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/20-svelte.md)

previous next

[Frequently asked questions](faq.html) [svelte/action](svelte-action.html)