import { Action, ActionType, diffElement } from './diff';
import { fragment } from './jsx';
import { createVNode, VNode, VTextNode } from './node';

export function createTag(
    tag: keyof HTMLElementTagNameMap,
    props: Record<string, string>,
): HTMLElement {
    const el = document.createElement(tag);

    for (const [key, value] of Object.entries(props)) {
        el.setAttribute(key, value);
    }

    return el;
}

export type Registry = {
    activeKey: string | undefined;
    registry: Record<string, Record<string, any>>;
};

const registry: Registry = {
    activeKey: undefined,
    registry: {},
};

export function useState<T>(initialValue: T) {
    /*
    const key = activeKey as string;

    if (!registry[key]) {
        registry[key] = { value: initialValue };
    }

    return [
        registry[key].value,
        (newValue: T) => {
            registry[key].value = newValue;
        },
    ] as const;
    /**/
}

export function createElement(
    vnode: VNode,
    key: string,
): HTMLElement | Text | DocumentFragment {
    if ('text' in vnode) {
        return document.createTextNode(vnode.text);
    }

    let element;

    if ('tag' in vnode) {
        element = document.createElement(vnode.tag);

        for (const [key, value] of Object.entries(vnode.props)) {
            element.setAttribute(key, value);
        }
    } else {
        element = document.createDocumentFragment();
    }

    vnode.children.forEach((child, i) => {
        element.appendChild(createElement(child, `${key}-${i}`));
    });

    return element;
}

export function apply(element: HTMLElement, action: Action, key: string): void {
    switch (action.type) {
        case ActionType.NO_ACTION:
            break;
        case ActionType.REPLACE:
            element.replaceWith(createElement(action.node, key));
            break;
        case ActionType.UPDATE:
            for (const prop in action.set) {
                element.setAttribute(prop, action.set[prop]);
            }

            for (const prop of action.remove) {
                element.removeAttribute(prop);
            }

            action.children.forEach((child, i) => {
                apply(element, child, `${key}-${i}`);
            });
            break;
        case ActionType.CREATE:
            element.appendChild(createElement(action.node, key));
            break;
        case ActionType.REMOVE:
            element.remove();
            break;
    }
}

let tree: JSX.Element = { tag: 'div', props: {}, children: [] };

export function rerender(): void {}

export function render(newTree: JSX.Element, mount: HTMLElement | null): void {
    if (mount === null) {
        throw new Error('Root element is null');
    }

    /**
     * Create VNode from JSX.Element
     * Store result in nodeTree
     */
    const vnode = createVNode(tree, 'root');
    const root = createElement(vnode, 'root') as HTMLElement;
    console.log('vnode', vnode);
    mount.appendChild(root);

    const newVnode = createVNode(newTree, 'root');
    console.log('newVnode', newVnode);
    const diff = diffElement(vnode, newVnode);

    apply(root, diff, 'root');

    console.log('diff', diff);
    console.log('register', registry);
}
