import { Action, ActionType, diffElement } from './diff';
import { createVNode, VNode } from './node';

export function isEvent(prop: string): boolean {
    return prop.indexOf('on') === 0;
}

export function addProperties(
    element: HTMLElement,
    props: Record<string, any>,
): void {
    for (const [key, value] of Object.entries(props)) {
        if (isEvent(key)) {
            const event = key.slice(2).toLowerCase();

            element.addEventListener(event, value as EventListener);
        } else {
            element.setAttribute(key, value);
        }
    }
}

export function removeProperties(
    element: HTMLElement,
    props: Record<string, any>,
): void {
    for (const [key, value] of Object.entries(props)) {
        if (isEvent(key)) {
            const event = key.slice(2).toLowerCase();

            element.removeEventListener(event, value as EventListener);
        } else {
            element.removeAttribute(key);
        }
    }
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

        addProperties(element, vnode.props);
    } else {
        element = document.createDocumentFragment();
    }

    vnode.children.forEach((child, i) => {
        element.appendChild(createElement(child, `${key}-${i}`));
    });

    return element;
}

export function apply(
    parent: HTMLElement,
    actions: Action[],
    key: string,
): void {
    const children = Array.from(parent.childNodes);

    actions.forEach((action, i) => {
        const child = children[i] as HTMLElement;

        switch (action.type) {
            case ActionType.NO_ACTION:
                break;
            case ActionType.REPLACE:
                child.replaceWith(createElement(action.node, `${key}-${i}`));
                break;
            case ActionType.UPDATE:
                removeProperties(child, action.remove);
                addProperties(child, action.set);

                apply(child, action.children, `${key}-${i}`);
                break;
            case ActionType.CREATE:
                parent.appendChild(createElement(action.node, `${key}-${i}`));
                break;
            case ActionType.REMOVE:
                child.remove();
                break;
        }
    });
}

let tree: JSX.Element = { tag: 'div', props: {}, children: [] };
let vnode: VNode;
let root: HTMLElement;

export async function rerender(): Promise<void> {
    const newVnode = createVNode(tree, 'root');
    const diff = diffElement(vnode, newVnode);

    apply(root.parentElement as HTMLElement, [diff], 'root');

    vnode = newVnode;
}

export function render(newTree: JSX.Element, mount: HTMLElement | null): void {
    if (mount === null) {
        throw new Error('Root element is null');
    }

    vnode = createVNode(tree, 'root');
    root = createElement(vnode, 'root') as HTMLElement;
    mount.appendChild(root);

    const newVnode = createVNode(newTree, 'root');
    const diff = diffElement(vnode, newVnode);

    apply(root.parentElement as HTMLElement, [diff], 'root');

    tree = newTree;
    vnode = newVnode;
}
