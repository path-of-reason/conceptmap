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

SvelteMisc

# TypeScript

### On this page

-   [TypeScript](typescript.html)
-   [<script lang=”ts”>](typescript.html#script-lang-ts)
-   [Preprocessor setup](typescript.html#Preprocessor-setup)
-   [tsconfig.json settings](typescript.html#tsconfig.json-settings)
-   [Typing $props](typescript.html#Typing-$props)
-   [Generic $props](typescript.html#Generic-$props)
-   [Typing wrapper components](typescript.html#Typing-wrapper-components)
-   [Typing $state](typescript.html#Typing-$state)
-   [The Component type](typescript.html#The-Component-type)
-   [Enhancing built-in DOM types](typescript.html#Enhancing-built-in-DOM-types)

You can use TypeScript within Svelte components. IDE extensions like the [Svelte VS Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) will help you catch errors right in your editor, and [`svelte-check`](https://www.npmjs.com/package/svelte-check) does the same on the command line, which you can integrate into your CI.

## <script lang="ts">[](typescript.html#script-lang-ts)

To use TypeScript inside your Svelte components, add `lang="ts"` to your `script` tags:

<script lang="ts">
	let name: string = 'world';
	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}
</script>
<button onclick={(e: Event) => greet(e.target.innerText)}>
	{name as string}
</button>

Doing so allows you to use TypeScript’s *type-only* features. That is, all features that just disappear when transpiling to JavaScript, such as type annotations or interface declarations. Features that require the TypeScript compiler to output actual code are not supported. This includes:

-   using enums
-   using `private`, `protected` or `public` modifiers in constructor functions together with initializers
-   using features that are not yet part of the ECMAScript standard (i.e. not level 4 in the TC39 process) and therefore not implemented yet within Acorn, the parser we use for parsing JavaScript

If you want to use one of these features, you need to setup up a `script` preprocessor.

## Preprocessor setup[](typescript.html#Preprocessor-setup)

To use non-type-only TypeScript features within Svelte components, you need to add a preprocessor that will turn TypeScript into JavaScript.

svelte.config

import { `function vitePreprocess(opts?: VitePreprocessOptions | undefined): import("svelte/compiler").PreprocessorGroup`vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const `const config: {     preprocess: PreprocessorGroup; }`config = {
	// Note the additional `{ script: true }`
	`preprocess: PreprocessorGroup`preprocess: `function vitePreprocess(opts?: VitePreprocessOptions | undefined): import("svelte/compiler").PreprocessorGroup`vitePreprocess({ `VitePreprocessOptions.script?: boolean | undefined`

preprocess script block with vite pipeline.
Since svelte5 this is not needed for typescript anymore

@defaultfalse

script: true })
};
export default `const config: {     preprocess: PreprocessorGroup; }`config;

### Using SvelteKit or Vite[](typescript.html#Preprocessor-setup-Using-SvelteKit-or-Vite)

The easiest way to get started is scaffolding a new SvelteKit project by typing `npx sv create`, following the prompts and choosing the TypeScript option.

svelte.config

import { `function vitePreprocess(opts?: VitePreprocessOptions | undefined): import("svelte/compiler").PreprocessorGroup`vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const `const config: {     preprocess: PreprocessorGroup; }`config = {
	`preprocess: PreprocessorGroup`preprocess: `function vitePreprocess(opts?: VitePreprocessOptions | undefined): import("svelte/compiler").PreprocessorGroup`vitePreprocess()
};
export default `const config: {     preprocess: PreprocessorGroup; }`config;

If you don’t need or want all the features SvelteKit has to offer, you can scaffold a Svelte-flavoured Vite project instead by typing `npm create vite@latest` and selecting the `svelte-ts` option.

In both cases, a `svelte.config.js` with `vitePreprocess` will be added. Vite/SvelteKit will read from this config file.

### Other build tools[](typescript.html#Preprocessor-setup-Other-build-tools)

If you’re using tools like Rollup or Webpack instead, install their respective Svelte plugins. For Rollup that’s [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte) and for Webpack that’s [svelte-loader](https://github.com/sveltejs/svelte-loader). For both, you need to install `typescript` and `svelte-preprocess` and add the preprocessor to the plugin config (see the respective READMEs for more info). If you’re starting a new project, you can also use the [rollup](https://github.com/sveltejs/template) or [webpack](https://github.com/sveltejs/template-webpack) template to scaffold the setup from a script.

> If you’re starting a new project, we recommend using SvelteKit or Vite instead

## tsconfig.json settings[](typescript.html#tsconfig.json-settings)

When using TypeScript, make sure your `tsconfig.json` is setup correctly.

-   Use a [`target`](https://www.typescriptlang.org/tsconfig/#target) of at least `ES2022`, or a `target` of at least `ES2015` alongside [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields). This ensures that rune declarations on class fields are not messed with, which would break the Svelte compiler
-   Set [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) to `true` so that imports are left as-is
-   Set [`isolatedModules`](https://www.typescriptlang.org/tsconfig/#isolatedModules) to `true` so that each file is looked at in isolation. TypeScript has a few features which require cross-file analysis and compilation, which the Svelte compiler and tooling like Vite don’t do.

## Typing $props[](typescript.html#Typing-$props)

Type `$props` just like a regular object with certain properties.

<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
		[key: string]: unknown;
	}
	let {
		requiredProperty,
		optionalProperty,
		snippetWithStringArgument,
		eventHandler,
		...everythingElse
	}: Props = $props();
</script>
<button onclick={() => eventHandler('clicked button')}>
	{@render snippetWithStringArgument('hello')}
</button>

## Generic $props[](typescript.html#Generic-$props)

Components can declare a generic relationship between their properties. One example is a generic list component that receives a list of items and a callback property that receives an item from the list. To declare that the `items` property and the `select` callback operate on the same types, add the `generics` attribute to the `script` tag:

<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
</script>
{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}

The content of `generics` is what you would put between the `<...>` tags of a generic function. In other words, you can use multiple generics, `extends` and fallback types.

## Typing wrapper components[](typescript.html#Typing-wrapper-components)

In case you’re writing a component that wraps a native element, you may want to expose all the attributes of the underlying element to the user. In that case, use (or extend from) one of the interfaces provided by `svelte/elements`. Here’s an example for a `Button` component:

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>
<button {...rest}>
	{@render children?.()}
</button>

Not all elements have a dedicated type definition. For those without one, use `SvelteHTMLElements`:

<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>
<div {...rest}>
	{@render children?.()}
</div>

## Typing $state[](typescript.html#Typing-$state)

You can type `$state` like any other variable.

let `let count: number`count: number = `function $state<0>(initial: 0): 0 (+1 overload) namespace $state`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state(0);

If you don’t give `$state` an initial value, part of its types will be `undefined`.

// Error: Type 'number | undefined' is not assignable to type 'number'
let `let count: number`count: number = `function $state<number>(): number | undefined (+1 overload) namespace $state`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state();

If you know that the variable *will* be defined before you first use it, use an `as` casting. This is especially useful in the context of classes:

class `class Counter`Counter {
	`Counter.count: number`count = `function $state<number>(): number | undefined (+1 overload) namespace $state`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state() as number;
	constructor(`initial: number`initial: number) {
		this.`Counter.count: number`count = `initial: number`initial;
	}
}

## The Component type[](typescript.html#The-Component-type)

Svelte components are of type `Component`. You can use it and its related types to express a variety of constraints.

Using it together with dynamic components to restrict what kinds of component can be passed to it:

<script lang="ts">
	import type { Component } from 'svelte';
	interface Props {
		// only components that have at most the "prop"
		// property required can be passed
		DynamicComponent: Component<{ prop: string }>;
	}
	let { DynamicComponent }: Props = $props();
</script>
<DynamicComponent prop="foo" />

> Legacy mode
> 
> In Svelte 4, components were of type `SvelteComponent`

To extract the properties from a component, use `ComponentProps`.

import type { `interface Component<Props extends Record<string, any> = {}, Exports extends Record<string, any> = {}, Bindings extends keyof Props | "" = string>`

Can be used to create strongly typed Svelte components.

#### Example:[](typescript.html#Example:)

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

#### Example:[](typescript.html#Example:)

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
) {}
// Errors if the second argument is not the correct props expected
// by the component in the first argument.
`function withProps<LegacyComponentType>(component: LegacyComponentType, props: Record<string, any>): void`withProps(`const MyComponent: LegacyComponentType`MyComponent, { `foo: string`foo: 'bar' });

To declare that a variable expects the constructor or instance type of a component:

<script lang="ts">
	import MyComponent from './MyComponent.svelte';
	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>
<MyComponent bind:this={componentInstance} />

## Enhancing built-in DOM types[](typescript.html#Enhancing-built-in-DOM-types)

Svelte provides a best effort of all the HTML DOM types that exist. Sometimes you may want to use experimental attributes or custom events coming from an action. In these cases, TypeScript will throw a type error, saying that it does not know these types. If it’s a non-experimental standard attribute/event, this may very well be a missing typing from our [HTML typings](https://github.com/sveltejs/svelte/blob/main/packages/svelte/elements.d.ts). In that case, you are welcome to open an issue and/or a PR fixing it.

In case this is a custom or experimental attribute/event, you can enhance the typings like this:

additional-svelte-typings.d

declare namespace svelteHTML {
	// enhance elements
	interface `interface svelteHTML.IntrinsicElements`IntrinsicElements {
		'my-custom-element': { `someattribute: string`someattribute: string; 'on:event': (`e: CustomEvent<any>`e: `interface CustomEvent<T = any>`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent)

CustomEvent<any>) => void };
	}
	// enhance attributes
	interface `interface svelteHTML.HTMLAttributes<T>`HTMLAttributes<`function (type parameter) T in HTMLAttributes<T>`T> {
		// If you want to use the beforeinstallprompt event
		`svelteHTML.HTMLAttributes<T>.onbeforeinstallprompt?: ((event: any) => any) | undefined`onbeforeinstallprompt?: (`event: any`event: any) => any;
		// If you want to use myCustomAttribute={..} (note: all lowercase)
		`svelteHTML.HTMLAttributes<T>.mycustomattribute?: any`mycustomattribute?: any; // You can replace any with something more specific if you like
	}
}

Then make sure that `d.ts` file is referenced in your `tsconfig.json`. If it reads something like `"include": ["src/**/*"]` and your `d.ts` file is inside `src`, it should work. You may need to reload for the changes to take effect.

You can also declare the typings by augmenting the `svelte/elements` module like this:

additional-svelte-typings.d

import { HTMLButtonAttributes } from 'svelte/elements';
declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}
	// allows for more granular control over what element to add the typings to
	export interface HTMLButtonAttributes {
		`HTMLButtonAttributes.veryexperimentalattribute?: string | undefined`veryexperimentalattribute?: string;
	}
}
export {}; // ensure this is not an ambient module, else types will be overridden instead of augmented

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/07-misc/03-typescript.md)

previous next

[Testing](testing.html) [Custom elements](custom-elements.html)