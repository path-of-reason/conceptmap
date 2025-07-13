SvelteReference

# svelte/action

### On this page

- [svelte/action](svelte-action.html)
- [Action](svelte-action.html#Action)
- [ActionReturn](svelte-action.html#ActionReturn)

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
any >

> {…}

<Node extends Element>(
...args: undefined extends Parameter
? [node: Node, parameter?: Parameter]
: [node: Node, parameter: Parameter]
): void | ActionReturn<Parameter, Attributes>;

## ActionReturn[](svelte-action.html#ActionReturn)

Actions can return an object containing the two properties defined in this interface. Both are optional.

- update: An action can have a parameter. This method will be called whenever that parameter changes, immediately after Svelte has applied updates to the markup. `ActionReturn` and `ActionReturn<undefined>` both mean that the action accepts no parameters.
- destroy: Method that is called after the element is unmounted

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
any >

> {…}

update?: (parameter: Parameter) => void;

destroy?: () => void;

[Edit this page on GitHub](https://github.com/sveltejs/svelte/edit/main/documentation/docs/98-reference/21-svelte-action.md)

previous next

[svelte](svelte.html) [svelte/animate](svelte-animate.html)
