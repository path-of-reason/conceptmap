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

# Runtime errors

### On this page

-   [Runtime errors](runtime-errors.html)
-   [Client errors](runtime-errors.html#Client-errors)
-   [Server errors](runtime-errors.html#Server-errors)
-   [Shared errors](runtime-errors.html#Shared-errors)

## Client errors[](runtime-errors.html#Client-errors)

### bind\_invalid\_checkbox\_value[](runtime-errors.html#Client-errors-bind_invalid_checkbox_value)

Using `bind:value` together with a checkbox input is not allowed. Use `bind:checked` instead

### bind\_invalid\_export[](runtime-errors.html#Client-errors-bind_invalid_export)

Component %component% has an export named `%key%` that a consumer component is trying to access using `bind:%key%`, which is disallowed. Instead, use `bind:this` (e.g. `<%name% bind:this={component} />`) and then access the property on the bound component instance (e.g. `component.%key%`)

### bind\_not\_bindable[](runtime-errors.html#Client-errors-bind_not_bindable)

A component is attempting to bind to a non-bindable property `%key%` belonging to %component% (i.e. `<%name% bind:%key%={...}>`). To mark a property as bindable: `let { %key% = $bindable() } = $props()`

### component\_api\_changed[](runtime-errors.html#Client-errors-component_api_changed)

%parent% called `%method%` on an instance of %component%, which is no longer valid in Svelte 5

See the [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more information.

### component\_api\_invalid\_new[](runtime-errors.html#Client-errors-component_api_invalid_new)

Attempted to instantiate %component% with `new %name%`, which is no longer valid in Svelte 5. If this component is not under your control, set the `compatibility.componentApi` compiler option to `4` to keep it working.

See the [migration guide](v5-migration-guide.html#Components-are-no-longer-classes) for more information.

### derived\_references\_self[](runtime-errors.html#Client-errors-derived_references_self)

A derived value cannot reference itself recursively

### each\_key\_duplicate[](runtime-errors.html#Client-errors-each_key_duplicate)

Keyed each block has duplicate key at indexes %a% and %b%

Keyed each block has duplicate key `%value%` at indexes %a% and %b%

### effect\_in\_teardown[](runtime-errors.html#Client-errors-effect_in_teardown)

`%rune%` cannot be used inside an effect cleanup function

### effect\_in\_unowned\_derived[](runtime-errors.html#Client-errors-effect_in_unowned_derived)

Effect cannot be created inside a `$derived` value that was not itself created inside an effect

### effect\_orphan[](runtime-errors.html#Client-errors-effect_orphan)

`%rune%` can only be used inside an effect (e.g. during component initialisation)

### effect\_update\_depth\_exceeded[](runtime-errors.html#Client-errors-effect_update_depth_exceeded)

Maximum update depth exceeded. This can happen when a reactive block or effect repeatedly sets a new value. Svelte limits the number of nested updates to prevent infinite loops

### hydration\_failed[](runtime-errors.html#Client-errors-hydration_failed)

Failed to hydrate the application

### invalid\_snippet[](runtime-errors.html#Client-errors-invalid_snippet)

Could not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`

### lifecycle\_legacy\_only[](runtime-errors.html#Client-errors-lifecycle_legacy_only)

`%name%(...)` cannot be used in runes mode

### props\_invalid\_value[](runtime-errors.html#Client-errors-props_invalid_value)

Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value

### props\_rest\_readonly[](runtime-errors.html#Client-errors-props_rest_readonly)

Rest element properties of `$props()` such as `%property%` are readonly

### rune\_outside\_svelte[](runtime-errors.html#Client-errors-rune_outside_svelte)

The `%rune%` rune is only available inside `.svelte` and `.svelte.js/ts` files

### state\_descriptors\_fixed[](runtime-errors.html#Client-errors-state_descriptors_fixed)

Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.

### state\_prototype\_fixed[](runtime-errors.html#Client-errors-state_prototype_fixed)

Cannot set prototype of `$state` object

### state\_unsafe\_mutation[](runtime-errors.html#Client-errors-state_unsafe_mutation)

Updating state inside a derived or a template expression is forbidden. If the value should not be reactive, declare it without `$state`

This error occurs when state is updated while evaluating a `$derived`. You might encounter it while trying to ‘derive’ two pieces of state in one go:

<script>
	let count = $state(0);
	let even = $state(true);
	let odd = $derived.by(() => {
		even = count % 2 === 0;
		return !even;
	});
</script>
<button onclick={() => count++}>{count}</button>
<p>{count} is even: {even}</p>
<p>{count} is odd: {odd}</p>

This is forbidden because it introduces instability: if `<p>{count} is even: {even}</p>` is updated before `odd` is recalculated, `even` will be stale. In most cases the solution is to make everything derived:

let `let even: boolean`even = `function $derived<boolean>(expression: boolean): boolean namespace $derived`

Declares derived state, i.e. one that depends on other state variables.
The expression inside `$derived(...)` should be free of side-effects.

Example:

let double = $derived(count * 2);

[https://svelte.dev/docs/svelte/$derived]($derived.html)

@paramexpression The derived state expression

$derived(`let count: number`count % 2 === 0);
let `let odd: boolean`odd = `function $derived<boolean>(expression: boolean): boolean namespace $derived`

Declares derived state, i.e. one that depends on other state variables.
The expression inside `$derived(...)` should be free of side-effects.

Example:

let double = $derived(count * 2);

[https://svelte.dev/docs/svelte/$derived]($derived.html)

@paramexpression The derived state expression

$derived(!`let even: boolean`even);

If side-effects are unavoidable, use [`$effect`]($effect.html) instead.

## Server errors[](runtime-errors.html#Server-errors)

### lifecycle\_function\_unavailable[](runtime-errors.html#Server-errors-lifecycle_function_unavailable)

`%name%(...)` is not available on the server

Certain methods such as `mount` cannot be invoked while running in a server context. Avoid calling them eagerly, i.e. not during render.

## Shared errors[](runtime-errors.html#Shared-errors)

### invalid\_default\_snippet[](runtime-errors.html#Shared-errors-invalid_default_snippet)

Cannot use `{@render children(...)}` if the parent component uses `let:` directives. Consider using a named snippet instead

This error would be thrown in a setup like this:

Parent

<List {items} let:entry>
	<span>{entry}</span>
</List>

List

<script>
	let { items, children } = $props();
</script>
<ul>
	{#each items as item}
		<li>{@render children(item)}</li>
	{/each}
</ul><script lang="ts">
	let { items, children } = $props();
</script>
<ul>
	{#each items as item}
		<li>{@render children(item)}</li>
	{/each}
</ul>

Here, `List.svelte` is using `{@render children(item)` which means it expects `Parent.svelte` to use snippets. Instead, `Parent.svelte` uses the deprecated `let:` directive. This combination of APIs is incompatible, hence the error.

### lifecycle\_outside\_component[](runtime-errors.html#Shared-errors-lifecycle_outside_component)

`%name%(...)` can only be used during component initialisation

Certain lifecycle methods can only be used during component initialisation. To fix this, make sure you’re invoking the method inside the *top level of the instance script* of your component.

<script>
	import { onMount } from 'svelte';
	function handleClick() {
		// This is wrong
		onMount(() => {})
	}
	// This is correct
	onMount(() => {})
</script>
<button onclick={handleClick}>click me</button>

### store\_invalid\_shape[](runtime-errors.html#Shared-errors-store_invalid_shape)

`%name%` is not a store with a `subscribe` method

### svelte\_element\_invalid\_this\_value[](runtime-errors.html#Shared-errors-svelte_element_invalid_this_value)

The `this` prop on `<svelte:element>` must be a string, if defined

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/30-runtime-errors.md)

previous next

[Compiler warnings](compiler-warnings.html) [Runtime warnings](runtime-warnings.html)