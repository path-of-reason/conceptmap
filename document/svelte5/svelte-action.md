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

# svelte/action

### On this page

-   [svelte/action](svelte-action.html)
-   [Action](svelte-action.html#Action)
-   [ActionReturn](svelte-action.html#ActionReturn)

## Action[](svelte-action.html#Action)

Actions are functions that are called when an element is created. You can use this interface to type such actions. The following example defines an action that only works on `<div>` elements and optionally accepts a parameter which it has a default value for:

export const `const myAction: Action<HTMLDivElement, {     someProperty: boolean; } | undefined>`myAction: `type Action = /*unresolved*/ any`Action<HTMLDivElement, { `someProperty: boolean`someProperty: boolean } | undefined> = (`node: any`node, `param: {     someProperty: boolean; }`param = { `someProperty: boolean`someProperty: true }) => {
	// ...
}

`Action<HTMLDivElement>` and `Action<HTMLDivElement, undefined>` both signal that the action accepts no parameters.

You can return an object with methods `update` and `destroy` from the function and type which additional attributes and events it has. See interface `ActionReturn` for more details.

interface Action<
	Element = HTMLElement,
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<
		never,
		any
	>
> {…}

<Node extends Element>(
	...args: undefined extends Parameter
		? [node: Node, parameter?: Parameter]
		: [node: Node, parameter: Parameter]
): void | ActionReturn<Parameter, Attributes>;

## ActionReturn[](svelte-action.html#ActionReturn)

Actions can return an object containing the two properties defined in this interface. Both are optional.

-   update: An action can have a parameter. This method will be called whenever that parameter changes, immediately after Svelte has applied updates to the markup. `ActionReturn` and `ActionReturn<undefined>` both mean that the action accepts no parameters.
-   destroy: Method that is called after the element is unmounted

Additionally, you can specify which additional attributes and events the action enables on the applied element. This applies to TypeScript typings only and has no effect at runtime.

Example usage:

interface Attributes {
	`Attributes.newprop?: string | undefined`newprop?: string;
	'on:event': (`e: CustomEvent<boolean>`e: `interface CustomEvent<T = any>`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent)

CustomEvent<boolean>) => void;
}
export function `function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes>`myAction(`node: HTMLElement`node: HTMLElement, `parameter: Parameter`parameter: `type Parameter = /*unresolved*/ any`Parameter): `type ActionReturn = /*unresolved*/ any`ActionReturn<`type Parameter = /*unresolved*/ any`Parameter, Attributes> {
	// ...
	return {
		`update: (updatedParameter: any) => void`update: (`updatedParameter: any`updatedParameter) => {...},
		destroy: () => {...}
	};
}

interface ActionReturn<
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<
		never,
		any
	>
> {…}

update?: (parameter: Parameter) => void;

destroy?: () => void;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-action.md)

previous next

[svelte](svelte.html) [svelte/animate](svelte-animate.html)