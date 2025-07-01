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

# Runtime warnings

### On this page

-   [Runtime warnings](runtime-warnings.html)
-   [Client warnings](runtime-warnings.html#Client-warnings)
-   [Shared warnings](runtime-warnings.html#Shared-warnings)

## Client warnings[](runtime-warnings.html#Client-warnings)

### assignment\_value\_stale[](runtime-warnings.html#Client-warnings-assignment_value_stale)

Assignment to `%property%` property (%location%) will evaluate to the right-hand side, not the value of `%property%` following the assignment. This may result in unexpected behaviour.

Given a case like this...

<script>
	let object = $state({ array: null });
	function add() {
		(object.array ??= []).push(object.array.length);
	}
</script>
<button onclick={add}>add</button>
<p>items: {JSON.stringify(object.items)}</p>

...the array being pushed to when the button is first clicked is the `[]` on the right-hand side of the assignment, but the resulting value of `object.array` is an empty state proxy. As a result, the pushed value will be discarded.

You can fix this by separating it into two statements:

function `function add(): void`add() {
	`let object: {     array: number[]; }`object.`array: number[]`array ??= [];
	`let object: {     array: number[]; }`object.`array: number[]`array.`Array<number>.push(...items: number[]): number`

Appends new elements to the end of an array, and returns the new length of the array.

@paramitems New elements to add to the array.

push(`let object: {     array: number[]; }`object.`array: number[]`array.`Array<number>.length: number`

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

length);
}

### binding\_property\_non\_reactive[](runtime-warnings.html#Client-warnings-binding_property_non_reactive)

`%binding%` is binding to a non-reactive property

`%binding%` (%location%) is binding to a non-reactive property

### console\_log\_state[](runtime-warnings.html#Client-warnings-console_log_state)

Your `console.%method%` contained `$state` proxies. Consider using `$inspect(...)` or `$state.snapshot(...)` instead

When logging a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), browser devtools will log the proxy itself rather than the value it represents. In the case of Svelte, the ‘target’ of a `$state` proxy might not resemble its current value, which can be confusing.

The easiest way to log a value as it changes over time is to use the [`$inspect`]($inspect.html) rune. Alternatively, to log things on a one-off basis (for example, inside an event handler) you can use [`$state.snapshot`]($state.html#$state.snapshot) to take a snapshot of the current value.

### event\_handler\_invalid[](runtime-warnings.html#Client-warnings-event_handler_invalid)

%handler% should be a function. Did you mean to %suggestion%?

### hydration\_attribute\_changed[](runtime-warnings.html#Client-warnings-hydration_attribute_changed)

The `%attribute%` attribute on `%html%` changed its value between server and client renders. The client value, `%value%`, will be ignored in favour of the server value

Certain attributes like `src` on an `<img>` element will not be repaired during hydration, i.e. the server value will be kept. That’s because updating these attributes can cause the image to be refetched (or in the case of an `<iframe>`, for the frame to be reloaded), even if they resolve to the same resource.

To fix this, either silence the warning with a [`svelte-ignore`](basic-markup.html#Comments) comment, or ensure that the value stays the same between server and client. If you really need the value to change on hydration, you can force an update like this:

<script>
	let { src } = $props();
	if (typeof window !== 'undefined') {
		// stash the value...
		const initial = src;
		// unset it...
		src = undefined;
		$effect(() => {
			// ...and reset after we've mounted
			src = initial;
		});
	}
</script>
<img {src} />

### hydration\_html\_changed[](runtime-warnings.html#Client-warnings-hydration_html_changed)

The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value

The value of an `{@html ...}` block %location% changed between server and client renders. The client value will be ignored in favour of the server value

If the `{@html ...}` value changes between the server and the client, it will not be repaired during hydration, i.e. the server value will be kept. That’s because change detection during hydration is expensive and usually unnecessary.

To fix this, either silence the warning with a [`svelte-ignore`](basic-markup.html#Comments) comment, or ensure that the value stays the same between server and client. If you really need the value to change on hydration, you can force an update like this:

<script>
	let { markup } = $props();
	if (typeof window !== 'undefined') {
		// stash the value...
		const initial = markup;
		// unset it...
		markup = undefined;
		$effect(() => {
			// ...and reset after we've mounted
			markup = initial;
		});
	}
</script>
{@html markup}

### hydration\_mismatch[](runtime-warnings.html#Client-warnings-hydration_mismatch)

Hydration failed because the initial UI does not match what was rendered on the server

Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near %location%

This warning is thrown when Svelte encounters an error while hydrating the HTML from the server. During hydration, Svelte walks the DOM, expecting a certain structure. If that structure is different (for example because the HTML was repaired by the DOM because of invalid HTML), then Svelte will run into issues, resulting in this warning.

During development, this error is often preceeded by a `console.error` detailing the offending HTML, which needs fixing.

### invalid\_raw\_snippet\_render[](runtime-warnings.html#Client-warnings-invalid_raw_snippet_render)

The `render` function passed to `createRawSnippet` should return HTML for a single element

### legacy\_recursive\_reactive\_block[](runtime-warnings.html#Client-warnings-legacy_recursive_reactive_block)

Detected a migrated `$:` reactive block in `%filename%` that both accesses and updates the same reactive value. This may cause recursive updates when converted to an `$effect`.

### lifecycle\_double\_unmount[](runtime-warnings.html#Client-warnings-lifecycle_double_unmount)

Tried to unmount a component that was not mounted

### ownership\_invalid\_binding[](runtime-warnings.html#Client-warnings-ownership_invalid_binding)

%parent% passed a value to %child% with `bind:`, but the value is owned by %owner%. Consider creating a binding between %owner% and %parent%

Consider three components `GrandParent`, `Parent` and `Child`. If you do `<GrandParent bind:value>`, inside `GrandParent` pass on the variable via `<Parent {value} />` (note the missing `bind:`) and then do `<Child bind:value>` inside `Parent`, this warning is thrown.

To fix it, `bind:` to the value instead of just passing a property (i.e. in this example do `<Parent bind:value />`).

### ownership\_invalid\_mutation[](runtime-warnings.html#Client-warnings-ownership_invalid_mutation)

Mutating a value outside the component that created it is strongly discouraged. Consider passing values to child components with `bind:`, or use a callback instead

%component% mutated a value owned by %owner%. This is strongly discouraged. Consider passing values to child components with `bind:`, or use a callback instead

Consider the following code:

App

<script>
	import Child from './Child.svelte';
	let person = $state({ name: 'Florida', surname: 'Man' });
</script>
<Child {person} /><script lang="ts">
	import Child from './Child.svelte';
	let person = $state({ name: 'Florida', surname: 'Man' });
</script>
<Child {person} />

Child

<script>
	let { person } = $props();
</script>
<input bind:value={person.name}>
<input bind:value={person.surname}><script lang="ts">
	let { person } = $props();
</script>
<input bind:value={person.name}>
<input bind:value={person.surname}>

`Child` is mutating `person` which is owned by `App` without being explicitly “allowed” to do so. This is strongly discouraged since it can create code that is hard to reason about at scale (“who mutated this value?”), hence the warning.

To fix it, either create callback props to communicate changes, or mark `person` as [`$bindable`]($bindable.html).

### state\_proxy\_equality\_mismatch[](runtime-warnings.html#Client-warnings-state_proxy_equality_mismatch)

Reactive `$state(...)` proxies and the values they proxy have different identities. Because of this, comparisons with `%operator%` will produce unexpected results

`$state(...)` creates a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) of the value it is passed. The proxy and the value have different identities, meaning equality checks will always return `false`:

<script>
	let value = { foo: 'bar' };
	let proxy = $state(value);
	value === proxy; // always false
</script>

To resolve this, ensure you’re comparing values where both values were created with `$state(...)`, or neither were. Note that `$state.raw(...)` will *not* create a state proxy.

### transition\_slide\_display[](runtime-warnings.html#Client-warnings-transition_slide_display)

The `slide` transition does not work correctly for elements with `display: %value%`

The [slide](svelte-transition.html#slide) transition works by animating the `height` of the element, which requires a `display` style like `block`, `flex` or `grid`. It does not work for:

-   `display: inline` (which is the default for elements like `<span>`), and its variants like `inline-block`, `inline-flex` and `inline-grid`
-   `display: table` and `table-[name]`, which are the defaults for elements like `<table>` and `<tr>`
-   `display: contents`

## Shared warnings[](runtime-warnings.html#Shared-warnings)

### dynamic\_void\_element\_content[](runtime-warnings.html#Shared-warnings-dynamic_void_element_content)

`<svelte:element this="%tag%">` is a void element — it cannot have content

Elements such as `<input>` cannot have content, any children passed to these elements will be ignored.

### state\_snapshot\_uncloneable[](runtime-warnings.html#Shared-warnings-state_snapshot_uncloneable)

Value cannot be cloned with `$state.snapshot` — the original value was returned

The following properties cannot be cloned with `$state.snapshot` — the return value contains the originals:
%properties%

`$state.snapshot` tries to clone the given value in order to return a reference that no longer changes. Certain objects may not be cloneable, in which case the original value is returned. In the following example, `property` is cloned, but `window` is not, because DOM elements are uncloneable:

const `const object: {     property: string;     window: Window & typeof globalThis; }`object = `function $state<{     property: string;     window: Window & typeof globalThis; }>(initial: {     property: string;     window: Window & typeof globalThis; }): {     property: string;     window: Window & typeof globalThis; } (+1 overload) namespace $state`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state({ `property: string`property: 'this is cloneable', `window: Window & typeof globalThis`window })
const `const snapshot: {     property: string;     window: {         [x: number]: {  [x: number]: ...;  readonly clientInformation: {    readonly clipboard: {        read: {};        readText: {};        write: {};        writeText: {};        addEventListener: {};        dispatchEvent: {};        removeEventListener: {};    };    ... 41 more ...;    readonly storage: {        ...;    };  };  ... 207 more ...;  readonly sessionStorage: {    ...;  };         };         ... 921 more ...;         undefined: undefined;     }; }`snapshot = `namespace $state function $state<T>(initial: T): T (+1 overload)`

Declares reactive state.

Example:

let count = $state(0);

[https://svelte.dev/docs/svelte/$state]($state.html)

@paraminitial The initial value

$state.`function $state.snapshot<{     property: string;     window: Window & typeof globalThis; }>(state: {     property: string;     window: Window & typeof globalThis; }): {     property: string;     window: {         ...;     }; }`

To take a static snapshot of a deeply reactive `$state` proxy, use `$state.snapshot`:

Example:

&#x3C;script>
  let counter = $state({ count: 0 });
  function onclick() {
	// Will log `{ count: ... }` rather than `Proxy { ... }`
	console.log($state.snapshot(counter));
  };
&#x3C;/script>

[https://svelte.dev/docs/svelte/$state#$state.snapshot]($state.html#$state.snapshot)

@paramstate The value to snapshot

snapshot(`const object: {     property: string;     window: Window & typeof globalThis; }`object);

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/30-runtime-warnings.md)

previous next

[Runtime errors](runtime-errors.html) [Overview](legacy-overview.html)