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

# svelte/reactivity

### On this page

-   [svelte/reactivity](svelte-reactivity.html)
-   [MediaQuery](svelte-reactivity.html#MediaQuery)
-   [SvelteDate](svelte-reactivity.html#SvelteDate)
-   [SvelteMap](svelte-reactivity.html#SvelteMap)
-   [SvelteSet](svelte-reactivity.html#SvelteSet)
-   [SvelteURL](svelte-reactivity.html#SvelteURL)
-   [SvelteURLSearchParams](svelte-reactivity.html#SvelteURLSearchParams)
-   [createSubscriber](svelte-reactivity.html#createSubscriber)

Svelte provides reactive versions of various built-ins like `SvelteMap`, `SvelteSet` and `SvelteURL`. These can be imported from `svelte/reactivity` and used just like their native counterparts.

<script>
	import { SvelteURL } from 'svelte/reactivity';
	const url = new SvelteURL('https://example.com/path');
</script>
<!-- changes to these... -->
<input bind:value={url.protocol} />
<input bind:value={url.hostname} />
<input bind:value={url.pathname} />
<hr />
<!-- will update `href` and vice versa -->
<input bind:value={url.href} />

import {
	`class MediaQuery`

Creates a media query and provides a `current` property that reflects whether or not it matches.

Use it carefully — during server-side rendering, there is no way to know what the correct value should be, potentially causing content to change upon hydration.
If you can use the media query in CSS to achieve the same effect, do that.

&#x3C;script>
	import { MediaQuery } from 'svelte/reactivity';
	const large = new MediaQuery('min-width: 800px');
&#x3C;/script>
&#x3C;h1>{large.current ? 'large screen' : 'small screen'}&#x3C;/h1>

@extendsReactiveValue<boolean> *

@since5.7.0

MediaQuery,
	`class SvelteDate`SvelteDate,
	`class SvelteMap<K, V>`SvelteMap,
	`class SvelteSet<T>`SvelteSet,
	`class SvelteURL`SvelteURL,
	`class SvelteURLSearchParams`SvelteURLSearchParams,
	`function createSubscriber(start: (update: () => void) => (() => void) | void): () => void`

Returns a `subscribe` function that, if called in an effect (including expressions in the template),
calls its `start` callback with an `update` function. Whenever `update` is called, the effect re-runs.

If `start` returns a function, it will be called when the effect is destroyed.

If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
are active, and the returned teardown function will only be called when all effects are destroyed.

It’s best understood with an example. Here’s an implementation of [`MediaQuery`](svelte-reactivity.html#MediaQuery):

import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';
export class MediaQuery {
	#query;
	#subscribe;
	constructor(query) {
		this.#query = window.matchMedia(`(${query})`);
		this.#subscribe = createSubscriber((update) => {
			// when the `change` event occurs, re-run any effects that read `this.current`
			const off = on(this.#query, 'change', update);
			// stop listening when all the effects are destroyed
			return () => off();
		});
	}
	get current() {
		this.#subscribe();
		// Return the current state of the query, whether or not we're in an effect
		return this.#query.matches;
	}
}

@since5.7.0

createSubscriber
} from 'svelte/reactivity';

## MediaQuery[](svelte-reactivity.html#MediaQuery)

> Available since 5.7.0

Creates a media query and provides a `current` property that reflects whether or not it matches.

Use it carefully — during server-side rendering, there is no way to know what the correct value should be, potentially causing content to change upon hydration. If you can use the media query in CSS to achieve the same effect, do that.

<script>
	import { MediaQuery } from 'svelte/reactivity';
	const large = new MediaQuery('min-width: 800px');
</script>
<h1>{large.current ? 'large screen' : 'small screen'}</h1>

class MediaQuery extends ReactiveValue<boolean> {…}

constructor(query: string, fallback?: boolean | undefined);

-   `query` A media query string
-   `fallback` Fallback value for the server

## SvelteDate[](svelte-reactivity.html#SvelteDate)

class SvelteDate extends Date {…}

constructor(...params: any[]);

## SvelteMap[](svelte-reactivity.html#SvelteMap)

class SvelteMap<K, V> extends Map<K, V> {…}

constructor(value?: Iterable<readonly [K, V]> | null | undefined);

set(key: K, value: V): this;

## SvelteSet[](svelte-reactivity.html#SvelteSet)

class SvelteSet<T> extends Set<T> {…}

constructor(value?: Iterable<T> | null | undefined);

add(value: T): this;

## SvelteURL[](svelte-reactivity.html#SvelteURL)

class SvelteURL extends URL {…}

get searchParams(): SvelteURLSearchParams;

## SvelteURLSearchParams[](svelte-reactivity.html#SvelteURLSearchParams)

class SvelteURLSearchParams extends URLSearchParams {…}

[REPLACE](params: URLSearchParams): void;

## createSubscriber[](svelte-reactivity.html#createSubscriber)

> Available since 5.7.0

Returns a `subscribe` function that, if called in an effect (including expressions in the template), calls its `start` callback with an `update` function. Whenever `update` is called, the effect re-runs.

If `start` returns a function, it will be called when the effect is destroyed.

If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects are active, and the returned teardown function will only be called when all effects are destroyed.

It’s best understood with an example. Here’s an implementation of [`MediaQuery`](svelte-reactivity.html#MediaQuery):

import { `function createSubscriber(start: (update: () => void) => (() => void) | void): () => void`

Returns a `subscribe` function that, if called in an effect (including expressions in the template),
calls its `start` callback with an `update` function. Whenever `update` is called, the effect re-runs.

If `start` returns a function, it will be called when the effect is destroyed.

If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
are active, and the returned teardown function will only be called when all effects are destroyed.

It’s best understood with an example. Here’s an implementation of [`MediaQuery`](svelte-reactivity.html#MediaQuery):

import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';
export class MediaQuery {
	#query;
	#subscribe;
	constructor(query) {
		this.#query = window.matchMedia(`(${query})`);
		this.#subscribe = createSubscriber((update) => {
			// when the `change` event occurs, re-run any effects that read `this.current`
			const off = on(this.#query, 'change', update);
			// stop listening when all the effects are destroyed
			return () => off();
		});
	}
	get current() {
		this.#subscribe();
		// Return the current state of the query, whether or not we're in an effect
		return this.#query.matches;
	}
}

@since5.7.0

createSubscriber } from 'svelte/reactivity';
import { `function on<Type extends keyof WindowEventMap>(window: Window, type: Type, handler: (this: Window, event: WindowEventMap[Type]) => any, options?: AddEventListenerOptions | undefined): () => void (+4 overloads)`

Attaches an event handler to the window and returns a function that removes the handler. Using this
rather than `addEventListener` will preserve the correct order relative to handlers added declaratively
(with attributes like `onclick`), which use event delegation for performance reasons

on } from 'svelte/events';
export class `class MediaQuery`MediaQuery {
	#query;
	#subscribe;
	constructor(`query: any`query) {
		this.#query = `var window: Window & typeof globalThis`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/window)

window.`function matchMedia(query: string): MediaQueryList`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/matchMedia)

matchMedia(`(${`query: any`query})`);
		this.#subscribe = `function createSubscriber(start: (update: () => void) => (() => void) | void): () => void`

Returns a `subscribe` function that, if called in an effect (including expressions in the template),
calls its `start` callback with an `update` function. Whenever `update` is called, the effect re-runs.

If `start` returns a function, it will be called when the effect is destroyed.

If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
are active, and the returned teardown function will only be called when all effects are destroyed.

It’s best understood with an example. Here’s an implementation of [`MediaQuery`](svelte-reactivity.html#MediaQuery):

import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';
export class MediaQuery {
	#query;
	#subscribe;
	constructor(query) {
		this.#query = window.matchMedia(`(${query})`);
		this.#subscribe = createSubscriber((update) => {
			// when the `change` event occurs, re-run any effects that read `this.current`
			const off = on(this.#query, 'change', update);
			// stop listening when all the effects are destroyed
			return () => off();
		});
	}
	get current() {
		this.#subscribe();
		// Return the current state of the query, whether or not we're in an effect
		return this.#query.matches;
	}
}

@since5.7.0

createSubscriber((`update: () => void`update) => {
			// when the `change` event occurs, re-run any effects that read `this.current`
			const `const off: () => void`off = `on<MediaQueryList, "change">(element: MediaQueryList, type: "change", handler: (this: MediaQueryList, event: MediaQueryListEvent) => any, options?: AddEventListenerOptions | undefined): () => void (+4 overloads)`

Attaches an event handler to an element and returns a function that removes the handler. Using this
rather than `addEventListener` will preserve the correct order relative to handlers added declaratively
(with attributes like `onclick`), which use event delegation for performance reasons

on(this.#query, 'change', `update: () => void`update);
			// stop listening when all the effects are destroyed
			return () => `const off: () => void`off();
		});
	}
	get `MediaQuery.current: boolean`current() {
		this.#subscribe();
		// Return the current state of the query, whether or not we're in an effect
		return this.#query.`MediaQueryList.matches: boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaQueryList/matches)

matches;
	}
}

function createSubscriber(
	start: (update: () => void) => (() => void) | void
): () => void;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-reactivity.md)

previous next

[svelte/reactivity/window](svelte-reactivity-window.html) [svelte/server](svelte-server.html)