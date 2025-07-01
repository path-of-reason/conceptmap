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

# Imperative component API

### On this page

-   [Imperative component API](legacy-component-api.html)
-   [Creating a component](legacy-component-api.html#Creating-a-component)
-   [$set](legacy-component-api.html#$set)
-   [$on](legacy-component-api.html#$on)
-   [$destroy](legacy-component-api.html#$destroy)
-   [Component props](legacy-component-api.html#Component-props)
-   [Server-side component API](legacy-component-api.html#Server-side-component-API)

In Svelte 3 and 4, the API for interacting with a component is different than in Svelte 5. Note that this page does *not* apply to legacy mode components in a Svelte 5 application.

## Creating a component[](legacy-component-api.html#Creating-a-component)

const `const component: any`component = new Component(options);

A client-side component — that is, a component compiled with `generate: 'dom'` (or the `generate` option left unspecified) is a JavaScript class.

import `type App = SvelteComponent<Record<string, any>, any, any> const App: LegacyComponentType`App from './App.svelte';
const `const app: SvelteComponent<Record<string, any>, any, any>`app = new `new App(o: ComponentConstructorOptions): SvelteComponent`App({
	`ComponentConstructorOptions<Record<string, any>>.target: Document | Element | ShadowRoot`target: `var document: Document`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/document)

document.`Document.body: HTMLElement`

Specifies the beginning and end of the document body.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/body)

body,
	`ComponentConstructorOptions<Record<string, any>>.props?: Record<string, any> | undefined`props: {
		// assuming App.svelte contains something like
		// `export let answer`:
		`answer: number`answer: 42
	}
});

The following initialisation options can be provided:

option

default

description

`target`

**none**

An `HTMLElement` or `ShadowRoot` to render to. This option is required

`anchor`

`null`

A child of `target` to render the component immediately before

`props`

`{}`

An object of properties to supply to the component

`context`

`new Map()`

A `Map` of root-level context key-value pairs to supply to the component

`hydrate`

`false`

See below

`intro`

`false`

If `true`, will play transitions on initial render, rather than waiting for subsequent state changes

Existing children of `target` are left where they are.

The `hydrate` option instructs Svelte to upgrade existing DOM (usually from server-side rendering) rather than creating new elements. It will only work if the component was compiled with the [`hydratable: true` option](https://svelte.dev/docs/svelte-compiler#compile). Hydration of `<head>` elements only works properly if the server-side rendering code was also compiled with `hydratable: true`, which adds a marker to each element in the `<head>` so that the component knows which elements it’s responsible for removing during hydration.

Whereas children of `target` are normally left alone, `hydrate: true` will cause any children to be removed. For that reason, the `anchor` option cannot be used alongside `hydrate: true`.

The existing DOM doesn’t need to match the component — Svelte will ‘repair’ the DOM as it goes.

index

import `type App = SvelteComponent<Record<string, any>, any, any> const App: LegacyComponentType`App from './App.svelte';
const `const app: SvelteComponent<Record<string, any>, any, any>`app = new `new App(o: ComponentConstructorOptions): SvelteComponent`App({
	`ComponentConstructorOptions<Record<string, any>>.target: Document | Element | ShadowRoot`target: `var document: Document`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/document)

document.`ParentNode.querySelector<Element>(selectors: string): Element | null (+4 overloads)`

Returns the first element that is a descendant of node that matches selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

querySelector('#server-rendered-html'),
	`ComponentConstructorOptions<Record<string, any>>.hydrate?: boolean | undefined`hydrate: true
});

> In Svelte 5+, use [`mount`](svelte.html#mount) instead

## $set[](legacy-component-api.html#$set)

component.$set(props);

Programmatically sets props on an instance. `component.$set({ x: 1 })` is equivalent to `x = 1` inside the component’s `<script>` block.

Calling this method schedules an update for the next microtask — the DOM is *not* updated synchronously.

component.$set({ `answer: number`answer: 42 });

> In Svelte 5+, use `$state` instead to create a component props and update that
> 
> let `module props let props: {     answer: number; }`props = `function $state<{     answer: number; }>(initial: {     answer: number; }): {     answer: number; } (+1 overload) namespace $state`
> 
> Declares reactive state.
> 
> Example:
> 
> let count = $state(0);
> 
> [https://svelte.dev/docs/svelte/$state]($state.html)
> 
> @paraminitial The initial value
> 
> $state({ `answer: number`answer: 42 });
> const `const component: any`component = mount(Component, { `props: {     answer: number; }`props });
> // ...
> `module props let props: {     answer: number; }`props.`answer: number`answer = 24;

## $on[](legacy-component-api.html#$on)

component.$on(ev, callback);

Causes the `callback` function to be called whenever the component dispatches an `event`.

A function is returned that will remove the event listener when called.

const `const off: any`off = component.$on('selected', (`event: any`event) => {
	`var console: Console`

The `console` module provides a simple debugging console that is similar to the
JavaScript console mechanism provided by web browsers.

The module exports two specific components:

-   A `Console` class with methods such as `console.log()`, `console.error()` and `console.warn()` that can be used to write to any Node.js stream.
-   A global `console` instance configured to write to [`process.stdout`](https://nodejs.org/docs/latest-v20.x/api/process.html#processstdout) and
    [`process.stderr`](https://nodejs.org/docs/latest-v20.x/api/process.html#processstderr). The global `console` can be used without calling `require('console')`.

***Warning***: The global console object’s methods are neither consistently
synchronous like the browser APIs they resemble, nor are they consistently
asynchronous like all other Node.js streams. See the [`note on process I/O`](https://nodejs.org/docs/latest-v20.x/api/process.html#a-note-on-process-io) for
more information.

Example using the global `console`:

console.log('hello world');
// Prints: hello world, to stdout
console.log('hello %s', 'world');
// Prints: hello world, to stdout
console.error(new Error('Whoops, something bad happened'));
// Prints error message and stack trace to stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3
const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to stderr

Example using the `Console` class:

const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);
myConsole.log('hello world');
// Prints: hello world, to out
myConsole.log('hello %s', 'world');
// Prints: hello world, to out
myConsole.error(new Error('Whoops, something bad happened'));
// Prints: [Error: Whoops, something bad happened], to err
const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to err

@see[source](https://github.com/nodejs/node/blob/v20.11.1/lib/console.js)

console.`Console.log(message?: any, ...optionalParams: any[]): void (+1 overload)`

Prints to `stdout` with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)
(the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v20.x/api/util.html#utilformatformat-args)).

const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout

See [`util.format()`](https://nodejs.org/docs/latest-v20.x/api/util.html#utilformatformat-args) for more information.

@sincev0.1.100

log(`event: any`event.detail.selection);
});
`const off: any`off();

> In Svelte 5+, pass callback props instead

## $destroy[](legacy-component-api.html#$destroy)

component.$destroy();

Removes a component from the DOM and triggers any `onDestroy` handlers.

> In Svelte 5+, use [`unmount`](svelte.html#unmount) instead

## Component props[](legacy-component-api.html#Component-props)

component.prop;

`module component`component.`component.prop: any`prop = value;

If a component is compiled with `accessors: true`, each instance will have getters and setters corresponding to each of the component’s props. Setting a value will cause a *synchronous* update, rather than the default async update caused by `component.$set(...)`.

By default, `accessors` is `false`, unless you’re compiling as a custom element.

`var console: Console`

The `console` module provides a simple debugging console that is similar to the
JavaScript console mechanism provided by web browsers.

The module exports two specific components:

-   A `Console` class with methods such as `console.log()`, `console.error()` and `console.warn()` that can be used to write to any Node.js stream.
-   A global `console` instance configured to write to [`process.stdout`](https://nodejs.org/docs/latest-v20.x/api/process.html#processstdout) and
    [`process.stderr`](https://nodejs.org/docs/latest-v20.x/api/process.html#processstderr). The global `console` can be used without calling `require('console')`.

***Warning***: The global console object’s methods are neither consistently
synchronous like the browser APIs they resemble, nor are they consistently
asynchronous like all other Node.js streams. See the [`note on process I/O`](https://nodejs.org/docs/latest-v20.x/api/process.html#a-note-on-process-io) for
more information.

Example using the global `console`:

console.log('hello world');
// Prints: hello world, to stdout
console.log('hello %s', 'world');
// Prints: hello world, to stdout
console.error(new Error('Whoops, something bad happened'));
// Prints error message and stack trace to stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3
const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to stderr

Example using the `Console` class:

const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);
myConsole.log('hello world');
// Prints: hello world, to out
myConsole.log('hello %s', 'world');
// Prints: hello world, to out
myConsole.error(new Error('Whoops, something bad happened'));
// Prints: [Error: Whoops, something bad happened], to err
const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to err

@see[source](https://github.com/nodejs/node/blob/v20.11.1/lib/console.js)

console.`Console.log(message?: any, ...optionalParams: any[]): void (+1 overload)`

Prints to `stdout` with newline. Multiple arguments can be passed, with the
first used as the primary message and all additional used as substitution
values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)
(the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v20.x/api/util.html#utilformatformat-args)).

const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout

See [`util.format()`](https://nodejs.org/docs/latest-v20.x/api/util.html#utilformatformat-args) for more information.

@sincev0.1.100

log(component.count);
component.count += 1;

> In Svelte 5+, this concept is obsolete. If you want to make properties accessible from the outside, `export` them

## Server-side component API[](legacy-component-api.html#Server-side-component-API)

const `const result: any`result = Component.render(...)

Unlike client-side components, server-side components don’t have a lifespan after you render them — their whole job is to create some HTML and CSS. For that reason, the API is somewhat different.

A server-side component exposes a `render` method that can be called with optional props. It returns an object with `head`, `html`, and `css` properties, where `head` contains the contents of any `<svelte:head>` elements encountered.

You can import a Svelte component directly into Node using `svelte/register`.

`var require: NodeRequire (id: string) => any`require('svelte/register');
const `const App: any`App = `var require: NodeRequire (id: string) => any`require('./App.svelte').default;
const { `const head: any`head, `const html: any`html, `const css: any`css } = `const App: any`App.render({
	`answer: number`answer: 42
});

The `.render()` method accepts the following parameters:

parameter

default

description

`props`

`{}`

An object of properties to supply to the component

`options`

`{}`

An object of options

The `options` object takes in the following options:

option

default

description

`context`

`new Map()`

A `Map` of root-level context key-value pairs to supply to the component

const { `const head: any`head, `const html: any`html, `const css: any`css } = App.render(
	// props
	{ `answer: number`answer: 42 },
	// options
	{
		`context: Map<string, string>`context: new `var Map: MapConstructor new <string, string>(iterable?: Iterable<readonly [string, string]> | null | undefined) => Map<string, string> (+3 overloads)`Map([['context-key', 'context-value']])
	}
);

> In Svelte 5+, use [`render`](svelte-server.html#render) instead

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/99-legacy/40-legacy-component-api.md)

previous next

[<svelte:self>](legacy-svelte-self.html)