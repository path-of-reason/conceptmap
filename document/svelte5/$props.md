SvelteRunes

# $props

### On this page

- [$props]($props.html)
- [Fallback values]($props.html#Fallback-values)
- [Renaming props]($props.html#Renaming-props)
- [Rest props]($props.html#Rest-props)
- [Updating props]($props.html#Updating-props)
- [Type safety]($props.html#Type-safety)
- [$props.id()](<$props.html#$props.id()>)

The inputs to a component are referred to as _props_, which is short for _properties_. You pass props to components just like you pass attributes to elements:

App

<script>
	import MyComponent from './MyComponent.svelte';
</script>

<MyComponent adjective="cool" /><script lang="ts">
import MyComponent from './MyComponent.svelte';
</script>
<MyComponent adjective="cool" />

On the other side, inside `MyComponent.svelte`, we can receive props with the `$props` rune...

MyComponent

<script>
	let props = $props();
</script>
<p>this component is {props.adjective}</p><script lang="ts">
	let props = $props();
</script>
<p>this component is {props.adjective}</p>

...though more commonly, you’ll [_destructure_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) your props:

MyComponent

<script>
	let { adjective } = $props();
</script>
<p>this component is {adjective}</p><script lang="ts">
	let { adjective } = $props();
</script>
<p>this component is {adjective}</p>

## Fallback values[]($props.html#Fallback-values)

Destructuring allows us to declare fallback values, which are used if the parent component does not set a given prop:

let { `let adjective: any`adjective = 'happy' } = `function $props(): any namespace $props`

Declares the props that a component accepts. Example:

let { optionalProp = 42, requiredProp, bindableProp = $bindable() }: { optionalProp?: number; requiredProps: string; bindableProp: boolean } = $props();

[https://svelte.dev/docs/svelte/$props]($props.html)

$props();

> Fallback values are not turned into reactive state proxies (see [Updating props]($props.html#Updating-props) for more info)

## Renaming props[]($props.html#Renaming-props)

We can also use the destructuring assignment to rename props, which is necessary if they’re invalid identifiers, or a JavaScript keyword like `super`:

let { super: `let trouper: any`trouper = 'lights are gonna find me' } = `function $props(): any namespace $props`

Declares the props that a component accepts. Example:

let { optionalProp = 42, requiredProp, bindableProp = $bindable() }: { optionalProp?: number; requiredProps: string; bindableProp: boolean } = $props();

[https://svelte.dev/docs/svelte/$props]($props.html)

$props();

## Rest props[]($props.html#Rest-props)

Finally, we can use a _rest property_ to get, well, the rest of the props:

let { `let a: any`a, `let b: any`b, `let c: any`c, ...`let others: any`others } = `function $props(): any namespace $props`

Declares the props that a component accepts. Example:

let { optionalProp = 42, requiredProp, bindableProp = $bindable() }: { optionalProp?: number; requiredProps: string; bindableProp: boolean } = $props();

[https://svelte.dev/docs/svelte/$props]($props.html)

$props();

## Updating props[]($props.html#Updating-props)

References to a prop inside a component update when the prop itself updates — when `count` changes in `App.svelte`, it will also change inside `Child.svelte`. But the child component is able to temporarily override the prop value, which can be useful for unsaved ephemeral state ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE6WQ0WrDMAxFf0WIQR0Wmu3VTQJln7HsIfVcZubIxlbGRvC_DzuBraN92qPula50tODZWB1RPi_IX16jLALWSOOUq6P3-_ihLWftNEZ9TVeOWBNHlNhGFYznfqCBzeRdYHh6M_YVzsFNsNs3pdpGd4eBcqPVDMrNxNDBXeSRtXioDgO1zU8ataeZ2RE4Utao924RFXQ9iHXwvoPHKpW1xY4g_Bg0cSVhKS0p560Za95612ZC02ONrD8ZJYdZp_rGQ37ff_mSP86Np2TWZaNNmdcH56P4P67K66_SXoK9pG-5dF5Z9QEAAA==)):

App

<script>
	import Child from './Child.svelte';
	let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
clicks (parent): {count}
</button>
<Child {count} /><script lang="ts">
import Child from './Child.svelte';
let count = $state(0);
</script>
<button onclick={() => (count += 1)}>
clicks (parent): {count}
</button>
<Child {count} />

Child

<script>
	let { count } = $props();
</script>

<button onclick={() => (count += 1)}>
clicks (child): {count}
</button><script lang="ts">
let { count } = $props();
</script>
<button onclick={() => (count += 1)}>
clicks (child): {count}
</button>

While you can temporarily _reassign_ props, you should not _mutate_ props unless they are [bindable]($bindable.html).

If the prop is a regular object, the mutation will have no effect ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE3WQwU7DMBBEf2W1QmorQgJXk0RC3PkBwiExG9WQrC17U4Es_ztKUkQp9OjxzM7bjcjtSKjwyfKNp1aLORA4b13ADHszUED1HFE-3eyaBcy-Mw_O5eFAg8xa1wb6T9eWhVgCKiyD9sZJ3XAjZnTWCzzuzfAKvbcjbPJieR2jm_uGy-InweXqtd0baaliBG0nFgW3kBIUNWYo9CGoxE-UsgvIpw2_oc9-LmAPJBCPDJCggqvlVtvdH9puErEMlvVg9HsVtzuoaojzkKKAfRuALVDfk5ZZW0fmy05wXcFdwyktlUs-KIinljTXrRVnm7-kL9dYLVbUAQAA)):

App

<script>
	import Child from './Child.svelte';
</script>

<Child object={{ count: 0 }} /><script lang="ts">
import Child from './Child.svelte';
</script>
<Child object={{ count: 0 }} />

Child

<script>
	let { object } = $props();
</script>

<button onclick={() => {
// has no effect
object.count += 1
}}>
clicks: {object.count}
</button><script lang="ts">
let { object } = $props();
</script>
<button onclick={() => {
// has no effect
object.count += 1
}}>
clicks: {object.count}
</button>

If the prop is a reactive state proxy, however, then mutations _will_ have an effect but you will see an [`ownership_invalid_mutation`](runtime-warnings.html#Client-warnings-ownership_invalid_mutation) warning, because the component is mutating state that does not ‘belong’ to it ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE3WR0U7DMAxFf8VESBuiauG1WycheOEbKA9p67FA6kSNszJV-XeUZhMw2GN8r-1znUmQ7FGU4pn2UqsOes-SlSGRia3S6ET5Mgk-2OiJBZGdOh6szd0eNcdaIx3-V28NMRI7UYq1awdleVNTzaq3ZmB43CndwXYwPSzyYn4dWxermqJRI4Np3rFlqODasWRcTtAaT1zCHYSbVU3r4nsyrdPMKTUFKDYiE4yfLEoePIbsQpqfy3_nOVMuJIqg0wk1RFg7GOuWfwEbz2wIDLVatR_VtLyBagNTHFIUMCqtoZXeIfAOU1JoUJsR2IC3nWTMjt7GM4yKdyBhlAMpesvhydCC0y_i0ZagHByMh26WzUhXUUxKnpbcVnBfUwhznJnNlac7JkuIURL-2VVfwxflyrWcSQIAAA==)):

App

<script>
	import Child from './Child.svelte';
	let object = $state({count: 0});
</script>

<Child {object} /><script lang="ts">
import Child from './Child.svelte';
let object = $state({count: 0});
</script>
<Child {object} />

Child

<script>
	let { object } = $props();
</script>

<button onclick={() => {
// will cause the count below to update,
// but with a warning. Don't mutate
// objects you don't own!
object.count += 1
}}>
clicks: {object.count}
</button><script lang="ts">
let { object } = $props();
</script>
<button onclick={() => {
// will cause the count below to update,
// but with a warning. Don't mutate
// objects you don't own!
object.count += 1
}}>
clicks: {object.count}
</button>

The fallback value of a prop not declared with `$bindable` is left untouched — it is not turned into a reactive state proxy — meaning mutations will not cause updates ([demo](https://svelte.dev/playground/untitled#H4sIAAAAAAAAE3WQwU7DMBBEf2VkIbUVoYFraCIh7vwA4eC4G9Wta1vxpgJZ_nfkBEQp9OjxzOzTRGHlkUQlXpy9G0gq1idCL43ppDrAD84HUYheGwqieo2CP3y2Z0EU3-En79fhRIaz1slA_-nKWSbLQVRiE9SgPTetbVkfvRsYzztttugHd8RiXU6vr-jisbWb8idhN7O3bEQhmN5ZVDyMlIorcOddv_Eufq4AGmJEuG5PilEjQrnRcoV7JCTUuJlGWq7-YHYjs7NwVhmtDnVcrlA3iLmzLLGTAdaB-j736h68Oxv-JM1I0AFjoG1OzPfX023c1nhobUoT39QeKsRzS8owM8DFTG_pE6dcVl70AQAA))

Child

<script>
	let { object = { count: 0 } } = $props();
</script>

<button onclick={() => {
// has no effect if the fallback value is used
object.count += 1
}}>
clicks: {object.count}
</button><script lang="ts">
let { object = { count: 0 } } = $props();
</script>
<button onclick={() => {
// has no effect if the fallback value is used
object.count += 1
}}>
clicks: {object.count}
</button>

In summary: don’t mutate props. Either use callback props to communicate changes, or — if parent and child should share the same object — use the [`$bindable`]($bindable.html) rune.

## Type safety[]($props.html#Type-safety)

You can add type safety to your components by annotating your props, as you would with any other variable declaration. In TypeScript that might look like this...

<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>

...while in JSDoc you can do this:

<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>

You can, of course, separate the type declaration from the annotation:

<script lang="ts">
	interface Props {
		adjective: string;
	}
	let { adjective }: Props = $props();
</script>

> Interfaces for native DOM elements are provided in the `svelte/elements` module (see [Typing wrapper components](typescript.html#Typing-wrapper-components))

Adding types is recommended, as it ensures that people using your component can easily discover which props they should provide.

## $props.id()[]($props.html#$props.id\(\))

This rune, added in version 5.20.0, generates an ID that is unique to the current component instance. When hydrating a server-rendered component, the value will be consistent between server and client.

This is useful for linking elements via attributes like `for` and `aria-labelledby`.

<script>
	const uid = $props.id();
</script>
<form>
	<label for="{uid}-firstname">First Name: </label>
	<input id="{uid}-firstname" type="text" />
	<label for="{uid}-lastname">Last Name: </label>
	<input id="{uid}-lastname" type="text" />
</form>

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/02-runes/05-$props.md)

previous next

[$effect]($effect.html) [$bindable]($bindable.html)
