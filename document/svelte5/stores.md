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

# Stores

### On this page

-   [Stores](stores.html)
-   [When to use stores](stores.html#When-to-use-stores)
-   [svelte/store](stores.html#svelte-store)
-   [Store contract](stores.html#Store-contract)

A *store* is an object that allows reactive access to a value via a simple *store contract*. The [`svelte/store` module](https://svelte.dev/docs/svelte-store) contains minimal store implementations which fulfil this contract.

Any time you have a reference to a store, you can access its value inside a component by prefixing it with the `$` character. This causes Svelte to declare the prefixed variable, subscribe to the store at component initialisation and unsubscribe when appropriate.

Assignments to `$`\-prefixed variables require that the variable be a writable store, and will result in a call to the store’s `.set` method.

Note that the store must be declared at the top level of the component — not inside an `if` block or a function, for example.

Local variables (that do not represent store values) must *not* have a `$` prefix.

<script>
	import { writable } from 'svelte/store';
	const count = writable(0);
	console.log($count); // logs 0
	count.set(1);
	console.log($count); // logs 1
	$count = 2;
	console.log($count); // logs 2
</script>

## When to use stores[](stores.html#When-to-use-stores)

Prior to Svelte 5, stores were the go-to solution for creating cross-component reactive states or extracting logic. With runes, these use cases have greatly diminished.

-   when extracting logic, it’s better to take advantage of runes’ universal reactivity: You can use runes outside the top level of components and even place them into JavaScript or TypeScript files (using a `.svelte.js` or `.svelte.ts` file ending)
-   when creating shared state, you can create a `$state` object containing the values you need and then manipulate said state

state.svelte

export const `const userState: {     name: string; }`userState = `function $state<{     name: string; }>(initial: {     name: string; }): {     name: string; } (+1 overload) namespace $state`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state({
	`name: string`name: 'name',
	/* ... */
});

App

<script>
	import { userState } from './state.svelte.js';
</script>
<p>User name: {userState.name}</p>
<button onclick={() => {
	userState.name = 'new name';
}}>
	change name
</button><script lang="ts">
	import { userState } from './state.svelte.js';
</script>
<p>User name: {userState.name}</p>
<button onclick={() => {
	userState.name = 'new name';
}}>
	change name
</button>

Stores are still a good solution when you have complex asynchronous data streams or it’s important to have more manual control over updating values or listening to changes. If you’re familiar with RxJs and want to reuse that knowledge, the `$` also comes in handy for you.

## svelte/store[](stores.html#svelte-store)

The `svelte/store` module contains a minimal store implementation which fulfil the store contract. It provides methods for creating stores that you can update from the outside, stores you can only update from the inside, and for combining and deriving stores.

### writable[](stores.html#svelte-store-writable)

Function that creates a store which has values that can be set from ‘outside’ components. It gets created as an object with additional `set` and `update` methods.

`set` is a method that takes one argument which is the value to be set. The store value gets set to the value of the argument if the store value is not already equal to it.

`update` is a method that takes one argument which is a callback. The callback takes the existing store value as its argument and returns the new value to be set to the store.

store

import { `function writable<T>(value?: T | undefined, start?: StartStopNotifier<T> | undefined): Writable<T>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable } from 'svelte/store';
const `const count: Writable<number>`count = `writable<number>(value?: number | undefined, start?: StartStopNotifier<number> | undefined): Writable<number>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable(0);
`const count: Writable<number>`count.`Readable<number>.subscribe(this: void, run: Subscriber<number>, invalidate?: () => void): Unsubscriber`

Subscribe on value changes.

@paramrun subscription callback

@paraminvalidate cleanup callback

subscribe((`value: number`value) => {
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

log(`value: number`value);
}); // logs '0'
`const count: Writable<number>`count.`Writable<number>.set(this: void, value: number): void`

Set value and inform subscribers.

@paramvalue to set

set(1); // logs '1'
`const count: Writable<number>`count.`Writable<number>.update(this: void, updater: Updater<number>): void`

Update value using callback and inform subscribers.

@paramupdater callback

update((`n: number`n) => `n: number`n + 1); // logs '2'

If a function is passed as the second argument, it will be called when the number of subscribers goes from zero to one (but not from one to two, etc). That function will be passed a `set` function which changes the value of the store, and an `update` function which works like the `update` method on the store, taking a callback to calculate the store’s new value from its old value. It must return a `stop` function that is called when the subscriber count goes from one to zero.

store

import { `function writable<T>(value?: T | undefined, start?: StartStopNotifier<T> | undefined): Writable<T>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable } from 'svelte/store';
const `const count: Writable<number>`count = `writable<number>(value?: number | undefined, start?: StartStopNotifier<number> | undefined): Writable<number>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable(0, () => {
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

log('got a subscriber');
	return () => `var console: Console`

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

log('no more subscribers');
});
`const count: Writable<number>`count.`Writable<number>.set(this: void, value: number): void`

Set value and inform subscribers.

@paramvalue to set

set(1); // does nothing
const `const unsubscribe: Unsubscriber`unsubscribe = `const count: Writable<number>`count.`Readable<number>.subscribe(this: void, run: Subscriber<number>, invalidate?: () => void): Unsubscriber`

Subscribe on value changes.

@paramrun subscription callback

@paraminvalidate cleanup callback

subscribe((`value: number`value) => {
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

log(`value: number`value);
}); // logs 'got a subscriber', then '1'
`const unsubscribe: () => void`unsubscribe(); // logs 'no more subscribers'

Note that the value of a `writable` is lost when it is destroyed, for example when the page is refreshed. However, you can write your own logic to sync the value to for example the `localStorage`.

### readable[](stores.html#svelte-store-readable)

Creates a store whose value cannot be set from ‘outside’, the first argument is the store’s initial value, and the second argument to `readable` is the same as the second argument to `writable`.

import { `function readable<T>(value?: T | undefined, start?: StartStopNotifier<T> | undefined): Readable<T>`

Creates a `Readable` store that allows reading by subscription.

@paramvalue initial value

readable } from 'svelte/store';
const `const time: Readable<Date>`time = `readable<Date>(value?: Date | undefined, start?: StartStopNotifier<Date> | undefined): Readable<Date>`

Creates a `Readable` store that allows reading by subscription.

@paramvalue initial value

readable(new `var Date: DateConstructor new () => Date (+4 overloads)`Date(), (`set: (value: Date) => void`set) => {
	`set: (value: Date) => void`set(new `var Date: DateConstructor new () => Date (+4 overloads)`Date());
	const `const interval: NodeJS.Timeout`interval = `function setInterval<[]>(callback: () => void, ms?: number): NodeJS.Timeout (+2 overloads)`

Schedules repeated execution of `callback` every `delay` milliseconds.

When `delay` is larger than `2147483647` or less than `1`, the `delay` will be
set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

This method has a custom variant for promises that is available using `timersPromises.setInterval()`.

@sincev0.0.1

@paramcallback The function to call when the timer elapses.

@paramdelay The number of milliseconds to wait before calling the `callback`.

@paramargs Optional arguments to pass when the `callback` is called.

@returnfor use with {@link clearInterval}

setInterval(() => {
		`set: (value: Date) => void`set(new `var Date: DateConstructor new () => Date (+4 overloads)`Date());
	}, 1000);
	return () => `function clearInterval(intervalId: NodeJS.Timeout | string | number | undefined): void (+1 overload)`

Cancels a `Timeout` object created by `setInterval()`.

@sincev0.0.1

@paramtimeout A `Timeout` object as returned by {@link setInterval} or the `primitive` of the `Timeout` object as a string or a number.

clearInterval(`const interval: NodeJS.Timeout`interval);
});
const `const ticktock: Readable<string>`ticktock = `readable<string>(value?: string | undefined, start?: StartStopNotifier<string> | undefined): Readable<string>`

Creates a `Readable` store that allows reading by subscription.

@paramvalue initial value

readable('tick', (`set: (value: string) => void`set, `update: (fn: Updater<string>) => void`update) => {
	const `const interval: NodeJS.Timeout`interval = `function setInterval<[]>(callback: () => void, ms?: number): NodeJS.Timeout (+2 overloads)`

Schedules repeated execution of `callback` every `delay` milliseconds.

When `delay` is larger than `2147483647` or less than `1`, the `delay` will be
set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

This method has a custom variant for promises that is available using `timersPromises.setInterval()`.

@sincev0.0.1

@paramcallback The function to call when the timer elapses.

@paramdelay The number of milliseconds to wait before calling the `callback`.

@paramargs Optional arguments to pass when the `callback` is called.

@returnfor use with {@link clearInterval}

setInterval(() => {
		`update: (fn: Updater<string>) => void`update((`sound: string`sound) => (`sound: string`sound === 'tick' ? 'tock' : 'tick'));
	}, 1000);
	return () => `function clearInterval(intervalId: NodeJS.Timeout | string | number | undefined): void (+1 overload)`

Cancels a `Timeout` object created by `setInterval()`.

@sincev0.0.1

@paramtimeout A `Timeout` object as returned by {@link setInterval} or the `primitive` of the `Timeout` object as a string or a number.

clearInterval(`const interval: NodeJS.Timeout`interval);
});

### derived[](stores.html#svelte-store-derived)

Derives a store from one or more other stores. The callback runs initially when the first subscriber subscribes and then whenever the store dependencies change.

In the simplest version, `derived` takes a single store, and the callback returns a derived value.

import { `function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void, initial_value?: T | undefined): Readable<T> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived } from 'svelte/store';
const `const doubled: Readable<number>`doubled = `derived<Writable<number>, number>(stores: Writable<number>, fn: (values: number) => number, initial_value?: number | undefined): Readable<number> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived(`const a: Writable<number>`a, (`$a: number`$a) => `$a: number`$a * 2);

The callback can set a value asynchronously by accepting a second argument, `set`, and an optional third argument, `update`, calling either or both of them when appropriate.

In this case, you can also pass a third argument to `derived` — the initial value of the derived store before `set` or `update` is first called. If no initial value is specified, the store’s initial value will be `undefined`.

import { `function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void, initial_value?: T | undefined): Readable<T> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived } from 'svelte/store';
const `const delayed: Readable<number>`delayed = `derived<Writable<number>, number>(stores: Writable<number>, fn: (values: number, set: (value: number) => void, update: (fn: Updater<number>) => void) => Unsubscriber | void, initial_value?: number | undefined): Readable<...> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived(
	`const a: Writable<number>`a,
	(`$a: number`$a, `set: (value: number) => void`set) => {
		`function setTimeout<[]>(callback: () => void, ms?: number): NodeJS.Timeout (+2 overloads)`

Schedules execution of a one-time `callback` after `delay` milliseconds.

The `callback` will likely not be invoked in precisely `delay` milliseconds.
Node.js makes no guarantees about the exact timing of when callbacks will fire,
nor of their ordering. The callback will be called as close as possible to the
time specified.

When `delay` is larger than `2147483647` or less than `1`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

This method has a custom variant for promises that is available using `timersPromises.setTimeout()`.

@sincev0.0.1

@paramcallback The function to call when the timer elapses.

@paramdelay The number of milliseconds to wait before calling the `callback`.

@paramargs Optional arguments to pass when the `callback` is called.

@returnfor use with {@link clearTimeout}

setTimeout(() => `set: (value: number) => void`set(`$a: number`$a), 1000);
	},
	2000
);
const `const delayedIncrement: Readable<unknown>`delayedIncrement = `derived<Writable<number>, unknown>(stores: Writable<number>, fn: (values: number, set: (value: unknown) => void, update: (fn: Updater<unknown>) => void) => Unsubscriber | void, initial_value?: unknown): Readable<...> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived(`const a: Writable<number>`a, (`$a: number`$a, `set: (value: unknown) => void`set, `update: (fn: Updater<unknown>) => void`update) => {
	`set: (value: unknown) => void`set(`$a: number`$a);
	`function setTimeout<[]>(callback: () => void, ms?: number): NodeJS.Timeout (+2 overloads)`

Schedules execution of a one-time `callback` after `delay` milliseconds.

The `callback` will likely not be invoked in precisely `delay` milliseconds.
Node.js makes no guarantees about the exact timing of when callbacks will fire,
nor of their ordering. The callback will be called as close as possible to the
time specified.

When `delay` is larger than `2147483647` or less than `1`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

This method has a custom variant for promises that is available using `timersPromises.setTimeout()`.

@sincev0.0.1

@paramcallback The function to call when the timer elapses.

@paramdelay The number of milliseconds to wait before calling the `callback`.

@paramargs Optional arguments to pass when the `callback` is called.

@returnfor use with {@link clearTimeout}

setTimeout(() => `update: (fn: Updater<unknown>) => void`update((`x: unknown`x) => x + 1), 1000);
	// every time $a produces a value, this produces two
	// values, $a immediately and then $a + 1 a second later
});

If you return a function from the callback, it will be called when a) the callback runs again, or b) the last subscriber unsubscribes.

import { `function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void, initial_value?: T | undefined): Readable<T> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived } from 'svelte/store';
const `const tick: Readable<number>`tick = `derived<Writable<number>, number>(stores: Writable<number>, fn: (values: number, set: (value: number) => void, update: (fn: Updater<number>) => void) => Unsubscriber | void, initial_value?: number | undefined): Readable<...> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived(
	`const frequency: Writable<number>`frequency,
	(`$frequency: number`$frequency, `set: (value: number) => void`set) => {
		const `const interval: NodeJS.Timeout`interval = `function setInterval<[]>(callback: () => void, ms?: number): NodeJS.Timeout (+2 overloads)`

Schedules repeated execution of `callback` every `delay` milliseconds.

When `delay` is larger than `2147483647` or less than `1`, the `delay` will be
set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

This method has a custom variant for promises that is available using `timersPromises.setInterval()`.

@sincev0.0.1

@paramcallback The function to call when the timer elapses.

@paramdelay The number of milliseconds to wait before calling the `callback`.

@paramargs Optional arguments to pass when the `callback` is called.

@returnfor use with {@link clearInterval}

setInterval(() => {
			`set: (value: number) => void`set(`var Date: DateConstructor`

Enables basic storage and retrieval of dates and times.

Date.`DateConstructor.now(): number`

Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).

now());
		}, 1000 / `$frequency: number`$frequency);
		return () => {
			`function clearInterval(intervalId: NodeJS.Timeout | string | number | undefined): void (+1 overload)`

Cancels a `Timeout` object created by `setInterval()`.

@sincev0.0.1

@paramtimeout A `Timeout` object as returned by {@link setInterval} or the `primitive` of the `Timeout` object as a string or a number.

clearInterval(`const interval: NodeJS.Timeout`interval);
		};
	},
	2000
);

In both cases, an array of arguments can be passed as the first argument instead of a single store.

import { `function derived<S extends Stores, T>(stores: S, fn: (values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void, initial_value?: T | undefined): Readable<T> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived } from 'svelte/store';
const `const summed: Readable<number>`summed = `derived<[Writable<number>, Writable<number>], number>(stores: [Writable<number>, Writable<number>], fn: (values: [number, number]) => number, initial_value?: number | undefined): Readable<...> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived([`const a: Writable<number>`a, `const b: Writable<number>`b], ([`$a: number`$a, `$b: number`$b]) => `$a: number`$a + `$b: number`$b);
const `const delayed: Readable<unknown>`delayed = `derived<[Writable<number>, Writable<number>], unknown>(stores: [Writable<number>, Writable<number>], fn: (values: [number, number], set: (value: unknown) => void, update: (fn: Updater<...>) => void) => Unsubscriber | void, initial_value?: unknown): Readable<...> (+1 overload)`

Derived value store by synchronizing one or more readable stores and
applying an aggregation function over its input values.

derived([`const a: Writable<number>`a, `const b: Writable<number>`b], ([`$a: number`$a, `$b: number`$b], `set: (value: unknown) => void`set) => {
	`function setTimeout<[]>(callback: () => void, ms?: number): NodeJS.Timeout (+2 overloads)`

Schedules execution of a one-time `callback` after `delay` milliseconds.

The `callback` will likely not be invoked in precisely `delay` milliseconds.
Node.js makes no guarantees about the exact timing of when callbacks will fire,
nor of their ordering. The callback will be called as close as possible to the
time specified.

When `delay` is larger than `2147483647` or less than `1`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.

If `callback` is not a function, a `TypeError` will be thrown.

This method has a custom variant for promises that is available using `timersPromises.setTimeout()`.

@sincev0.0.1

@paramcallback The function to call when the timer elapses.

@paramdelay The number of milliseconds to wait before calling the `callback`.

@paramargs Optional arguments to pass when the `callback` is called.

@returnfor use with {@link clearTimeout}

setTimeout(() => `set: (value: unknown) => void`set(`$a: number`$a + `$b: number`$b), 1000);
});

### readonly[](stores.html#svelte-store-readonly)

This simple helper function makes a store readonly. You can still subscribe to the changes from the original one using this new readable store.

import { `function readonly<T>(store: Readable<T>): Readable<T>`

Takes a store and returns a new one derived from the old one that is readable.

@paramstore - store to make readonly

readonly, `function writable<T>(value?: T | undefined, start?: StartStopNotifier<T> | undefined): Writable<T>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable } from 'svelte/store';
const `const writableStore: Writable<number>`writableStore = `writable<number>(value?: number | undefined, start?: StartStopNotifier<number> | undefined): Writable<number>`

Create a `Writable` store that allows both updating and reading by subscription.

@paramvalue initial value

writable(1);
const `const readableStore: Readable<number>`readableStore = `readonly<number>(store: Readable<number>): Readable<number>`

Takes a store and returns a new one derived from the old one that is readable.

@paramstore - store to make readonly

readonly(`const writableStore: Writable<number>`writableStore);
`const readableStore: Readable<number>`readableStore.`Readable<number>.subscribe(this: void, run: Subscriber<number>, invalidate?: () => void): Unsubscriber`

Subscribe on value changes.

@paramrun subscription callback

@paraminvalidate cleanup callback

subscribe(`var console: Console`

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

console.`Console.log(...data: any[]): void (+1 overload)`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/console/log_static)

log);
`const writableStore: Writable<number>`writableStore.`Writable<number>.set(this: void, value: number): void`

Set value and inform subscribers.

@paramvalue to set

set(2); // console: 2
`const readableStore: Readable<number>`readableStore.set(2); // ERROR

### get[](stores.html#svelte-store-get)

Generally, you should read the value of a store by subscribing to it and using the value as it changes over time. Occasionally, you may need to retrieve the value of a store to which you’re not subscribed. `get` allows you to do so.

> This works by creating a subscription, reading the value, then unsubscribing. It’s therefore not recommended in hot code paths.

import { `function get<T>(store: Readable<T>): T`

Get the current value from a store by subscribing and immediately unsubscribing.

get } from 'svelte/store';
const `const value: string`value = `get<string>(store: Readable<string>): string`

Get the current value from a store by subscribing and immediately unsubscribing.

get(`const store: Writable<string>`store);

## Store contract[](stores.html#Store-contract)

store = { `subscribe: (subscription: (value: any) => void) => () => undefined`subscribe: (`subscription: (value: any) => void`subscription: (`value: any`value: any) => void) => (() => void), `set: (value: any) => undefined`set?: (`value: any`value: any) => void }

You can create your own stores without relying on [`svelte/store`](https://svelte.dev/docs/svelte-store), by implementing the *store contract*:

1.  A store must contain a `.subscribe` method, which must accept as its argument a subscription function. This subscription function must be immediately and synchronously called with the store’s current value upon calling `.subscribe`. All of a store’s active subscription functions must later be synchronously called whenever the store’s value changes.
2.  The `.subscribe` method must return an unsubscribe function. Calling an unsubscribe function must stop its subscription, and its corresponding subscription function must not be called again by the store.
3.  A store may *optionally* contain a `.set` method, which must accept as its argument a new value for the store, and which synchronously calls all of the store’s active subscription functions. Such a store is called a *writable store*.

For interoperability with RxJS Observables, the `.subscribe` method is also allowed to return an object with an `.unsubscribe` method, rather than return the unsubscription function directly. Note however that unless `.subscribe` synchronously calls the subscription (which is not required by the Observable spec), Svelte will see the value of the store as `undefined` until it does.

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/06-runtime/01-stores.md)

previous next

[<svelte:options>](svelte-options.html) [Context](context.html)