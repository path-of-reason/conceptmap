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

# Imperative component API

### On this page

-   [Imperative component API](imperative-component-api.html)
-   [mount](imperative-component-api.html#mount)
-   [unmount](imperative-component-api.html#unmount)
-   [render](imperative-component-api.html#render)
-   [hydrate](imperative-component-api.html#hydrate)

Every Svelte application starts by imperatively creating a root component. On the client this component is mounted to a specific element. On the server, you want to get back a string of HTML instead which you can render. The following functions help you achieve those tasks.

## mount[](imperative-component-api.html#mount)

Instantiates a component and mounts it to the given target:

import { `function mount<Props extends Record<string, any>, Exports extends Record<string, any>>(component: ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>, options: MountOptions<Props>): Exports`

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
Transitions will play during the initial render unless the `intro` option is set to `false`.

mount } from 'svelte';
import `type App = SvelteComponent<Record<string, any>, any, any> const App: LegacyComponentType`App from './App.svelte';
const `const app: {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<string, any>`app = `mount<Record<string, any>, {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<...>>(component: ComponentType<...> | Component<...>, options: MountOptions<...>): {     ...; } & Record<...>`

Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
Transitions will play during the initial render unless the `intro` option is set to `false`.

mount(`const App: LegacyComponentType`App, {
	`target: Document | Element | ShadowRoot`

Target element where the component will be mounted.

target: `var document: Document`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/document)

document.`ParentNode.querySelector<Element>(selectors: string): Element | null (+4 overloads)`

Returns the first element that is a descendant of node that matches selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

querySelector('#app'),
	`props?: Record<string, any> | undefined`

Component properties.

props: { `some: string`some: 'property' }
});

You can mount multiple components per page, and you can also mount from within your application, for example when creating a tooltip component and attaching it to the hovered element.

Note that unlike calling `new App(...)` in Svelte 4, things like effects (including `onMount` callbacks, and action functions) will not run during `mount`. If you need to force pending effects to run (in the context of a test, for example) you can do so with `flushSync()`.

## unmount[](imperative-component-api.html#unmount)

Unmounts a component that was previously created with [`mount`](imperative-component-api.html#mount) or [`hydrate`](imperative-component-api.html#hydrate).

If `options.outro` is `true`, [transitions](transition.html) will play before the component is removed from the DOM:

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
// later
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

Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise.

## render[](imperative-component-api.html#render)

Only available on the server and when compiling with the `server` option. Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app:

import { `function render<Comp extends SvelteComponent<any> | Component<any>, Props extends ComponentProps<Comp> = ComponentProps<Comp>>(...args: {} extends Props ? [component: Comp extends SvelteComponent<any> ? ComponentType<Comp> : Comp, options?: {     props?: Omit<Props, "$$slots" | "$$events">;     context?: Map<any, any>;     idPrefix?: string; }] : [component: Comp extends SvelteComponent<any> ? ComponentType<Comp> : Comp, options: {     props: Omit<Props, "$$slots" | "$$events">;     context?: Map<any, any>;     idPrefix?: string; }]): RenderOutput`

Only available on the server and when compiling with the `server` option.
Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.

render } from 'svelte/server';
import `type App = SvelteComponent<Record<string, any>, any, any> const App: LegacyComponentType`App from './App.svelte';
const `const result: RenderOutput`result = `render<SvelteComponent<Record<string, any>, any, any>, Record<string, any>>(component: ComponentType<SvelteComponent<Record<string, any>, any, any>>, options?: {     ...; } | undefined): RenderOutput`

Only available on the server and when compiling with the `server` option.
Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.

render(`const App: LegacyComponentType`App, {
	`props?: Omit<Record<string, any>, "$$slots" | "$$events"> | undefined`props: { `some: string`some: 'property' }
});
`const result: RenderOutput`result.`RenderOutput.body: string`

HTML that goes somewhere into the `&#x3C;body>`

body; // HTML for somewhere in this <body> tag
`const result: RenderOutput`result.`RenderOutput.head: string`

HTML that goes into the `&#x3C;head>`

head; // HTML for somewhere in this <head> tag

## hydrate[](imperative-component-api.html#hydrate)

Like `mount`, but will reuse up any HTML rendered by Svelte’s SSR output (from the [`render`](imperative-component-api.html#render) function) inside the target and make it interactive:

import { `function hydrate<Props extends Record<string, any>, Exports extends Record<string, any>>(component: ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>, options: {} extends Props ? {     target: Document | Element | ShadowRoot;     props?: Props;     events?: Record<string, (e: any) => any>;     context?: Map<any, any>;     intro?: boolean;     recover?: boolean; } : {     target: Document | Element | ShadowRoot;     props: Props;     events?: Record<string, (e: any) => any>;     context?: Map<any, any>;     intro?: boolean;     recover?: boolean; }): Exports`

Hydrates a component on the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component

hydrate } from 'svelte';
import `type App = SvelteComponent<Record<string, any>, any, any> const App: LegacyComponentType`App from './App.svelte';
const `const app: {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<string, any>`app = `hydrate<Record<string, any>, {     $on?(type: string, callback: (e: any) => void): () => void;     $set?(props: Partial<Record<string, any>>): void; } & Record<...>>(component: ComponentType<...> | Component<...>, options: {     ...; }): {     ...; } & Record<...>`

Hydrates a component on the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component

hydrate(`const App: LegacyComponentType`App, {
	`target: Document | Element | ShadowRoot`target: `var document: Document`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/document)

document.`ParentNode.querySelector<Element>(selectors: string): Element | null (+4 overloads)`

Returns the first element that is a descendant of node that matches selectors.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)

querySelector('#app'),
	`props?: Record<string, any> | undefined`props: { `some: string`some: 'property' }
});

As with `mount`, effects will not run during `hydrate` — use `flushSync()` immediately afterwards if you need them to.

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/06-runtime/04-imperative-component-api.md)

previous next

[Lifecycle hooks](lifecycle-hooks.html) [Testing](testing.html)