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

# svelte/motion

### On this page

-   [svelte/motion](svelte-motion.html)
-   [Spring](svelte-motion.html#Spring)
-   [Tween](svelte-motion.html#Tween)
-   [prefersReducedMotion](svelte-motion.html#prefersReducedMotion)
-   [spring](svelte-motion.html#spring)
-   [tweened](svelte-motion.html#tweened)
-   [Spring](svelte-motion.html#Spring)
-   [Tweened](svelte-motion.html#Tweened)

import {
	`class Spring<T> interface Spring<T>`

A wrapper for a value that behaves in a spring-like fashion. Changes to `spring.target` will cause `spring.current` to
move towards it over time, taking account of the `spring.stiffness` and `spring.damping` parameters.

&#x3C;script>
	import { Spring } from 'svelte/motion';
	const spring = new Spring(0);
&#x3C;/script>
&#x3C;input type="range" bind:value={spring.target} />
&#x3C;input type="range" bind:value={spring.current} disabled />

@since5.8.0

Spring,
	`class Tween<T>`

A wrapper for a value that tweens smoothly to its target value. Changes to `tween.target` will cause `tween.current` to
move towards it over time, taking account of the `delay`, `duration` and `easing` options.

&#x3C;script>
	import { Tween } from 'svelte/motion';
	const tween = new Tween(0);
&#x3C;/script>
&#x3C;input type="range" bind:value={tween.target} />
&#x3C;input type="range" bind:value={tween.current} disabled />

@since5.8.0

Tween,
	`const prefersReducedMotion: MediaQuery`

A [media query](svelte-reactivity.html#MediaQuery) that matches if the user [prefers reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

&#x3C;script>
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	let visible = $state(false);
&#x3C;/script>
&#x3C;button onclick={() => visible = !visible}>
	toggle
&#x3C;/button>
{#if visible}
	&#x3C;p transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}>
		flies in, unless the user prefers reduced motion
	&#x3C;/p>
{/if}

@since5.7.0

prefersReducedMotion,
	`function spring<T = any>(value?: T | undefined, opts?: SpringOpts | undefined): Spring<T>`

The spring function in Svelte creates a store whose value is animated, with a motion that simulates the behavior of a spring. This means when the value changes, instead of transitioning at a steady rate, it “bounces” like a spring would, depending on the physics parameters provided. This adds a level of realism to the transitions and can enhance the user experience.

@deprecatedUse [`Spring`](svelte-motion.html#Spring) instead

spring,
	`function tweened<T>(value?: T | undefined, defaults?: TweenedOptions<T> | undefined): Tweened<T>`

A tweened store in Svelte is a special type of store that provides smooth transitions between state values over time.

@deprecatedUse [`Tween`](svelte-motion.html#Tween) instead

tweened
} from 'svelte/motion';

## Spring[](svelte-motion.html#Spring)

> Available since 5.8.0

A wrapper for a value that behaves in a spring-like fashion. Changes to `spring.target` will cause `spring.current` to move towards it over time, taking account of the `spring.stiffness` and `spring.damping` parameters.

<script>
	import { Spring } from 'svelte/motion';
	const spring = new Spring(0);
</script>
<input type="range" bind:value={spring.target} />
<input type="range" bind:value={spring.current} disabled />

class Spring<T> {…}

constructor(value: T, options?: SpringOpts);

static of<U>(fn: () => U, options?: SpringOpts): Spring<U>;

Create a spring whose value is bound to the return value of `fn`. This must be called inside an effect root (for example, during component initialisation).

<script>
	import { Spring } from 'svelte/motion';
	let { number } = $props();
	const spring = Spring.of(() => number);
</script>

set(value: T, options?: SpringUpdateOpts): Promise<void>;

Sets `spring.target` to `value` and returns a `Promise` that resolves if and when `spring.current` catches up to it.

If `options.instant` is `true`, `spring.current` immediately matches `spring.target`.

If `options.preserveMomentum` is provided, the spring will continue on its current trajectory for the specified number of milliseconds. This is useful for things like ‘fling’ gestures.

damping: number;

precision: number;

stiffness: number;

target: T;

The end value of the spring. This property only exists on the `Spring` class, not the legacy `spring` store.

get current(): T;

The current value of the spring. This property only exists on the `Spring` class, not the legacy `spring` store.

## Tween[](svelte-motion.html#Tween)

> Available since 5.8.0

A wrapper for a value that tweens smoothly to its target value. Changes to `tween.target` will cause `tween.current` to move towards it over time, taking account of the `delay`, `duration` and `easing` options.

<script>
	import { Tween } from 'svelte/motion';
	const tween = new Tween(0);
</script>
<input type="range" bind:value={tween.target} />
<input type="range" bind:value={tween.current} disabled />

class Tween<T> {…}

static of<U>(fn: () => U, options?: TweenedOptions<U> | undefined): Tween<U>;

Create a tween whose value is bound to the return value of `fn`. This must be called inside an effect root (for example, during component initialisation).

<script>
	import { Tween } from 'svelte/motion';
	let { number } = $props();
	const tween = Tween.of(() => number);
</script>

constructor(value: T, options?: TweenedOptions<T>);

set(value: T, options?: TweenedOptions<T> | undefined): Promise<void>;

Sets `tween.target` to `value` and returns a `Promise` that resolves if and when `tween.current` catches up to it.

If `options` are provided, they will override the tween’s defaults.

get current(): T;

set target(v: T);

get target(): T;

## prefersReducedMotion[](svelte-motion.html#prefersReducedMotion)

> Available since 5.7.0

A [media query](svelte-reactivity.html#MediaQuery) that matches if the user [prefers reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

<script>
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	let visible = $state(false);
</script>
<button onclick={() => visible = !visible}>
	toggle
</button>
{#if visible}
	<p transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}>
		flies in, unless the user prefers reduced motion
	</p>
{/if}

const prefersReducedMotion: MediaQuery;

## spring[](svelte-motion.html#spring)

> Use [`Spring`](svelte-motion.html#Spring) instead

The spring function in Svelte creates a store whose value is animated, with a motion that simulates the behavior of a spring. This means when the value changes, instead of transitioning at a steady rate, it “bounces” like a spring would, depending on the physics parameters provided. This adds a level of realism to the transitions and can enhance the user experience.

function spring<T = any>(
	value?: T | undefined,
	opts?: SpringOpts | undefined
): Spring<T>;

## tweened[](svelte-motion.html#tweened)

> Use [`Tween`](svelte-motion.html#Tween) instead

A tweened store in Svelte is a special type of store that provides smooth transitions between state values over time.

function tweened<T>(
	value?: T | undefined,
	defaults?: TweenedOptions<T> | undefined
): Tweened<T>;

## Spring[](svelte-motion.html#Spring)

interface Spring<T> extends Readable<T> {…}

set(new_value: T, opts?: SpringUpdateOpts): Promise<void>;

update: (fn: Updater<T>, opts?: SpringUpdateOpts) => Promise<void>;

-   deprecated Only exists on the legacy `spring` store, not the `Spring` class

subscribe(fn: (value: T) => void): Unsubscriber;

-   deprecated Only exists on the legacy `spring` store, not the `Spring` class

precision: number;

damping: number;

stiffness: number;

## Tweened[](svelte-motion.html#Tweened)

interface Tweened<T> extends Readable<T> {…}

set(value: T, opts?: TweenedOptions<T>): Promise<void>;

update(updater: Updater<T>, opts?: TweenedOptions<T>): Promise<void>;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-motion.md)

previous next

[svelte/legacy](svelte-legacy.html) [svelte/reactivity/window](svelte-reactivity-window.html)