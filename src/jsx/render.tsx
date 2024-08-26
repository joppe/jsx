import { Action, ActionType, diffElement } from './diff';
import {
    addProperties,
    createFragmentElement,
    createHTMLElement,
    createTextElement,
    removeProperties,
} from './dom';
import { createVNode, VNode } from './node';

export function createElement(
    vnode: VNode,
): HTMLElement | Text | DocumentFragment {
    if ('text' in vnode) {
        return createTextElement(vnode.text);
    }

    let element;

    if ('tag' in vnode) {
        element = createHTMLElement(vnode.tag);

        addProperties(element, vnode.props);
    } else {
        element = createFragmentElement();
    }

    vnode.children.forEach((child) => {
        element.appendChild(createElement(child));
    });

    return element;
}

export function apply(parent: HTMLElement, actions: Action[]): void {
    const children = Array.from(parent.childNodes);

    actions.forEach((action, i) => {
        const child = children[i] as HTMLElement;

        switch (action.type) {
            case ActionType.NO_ACTION:
                break;
            case ActionType.REPLACE:
                child.replaceWith(createElement(action.node));
                break;
            case ActionType.UPDATE:
                removeProperties(child, action.remove);
                addProperties(child, action.set);

                apply(child, action.children);
                break;
            case ActionType.CREATE:
                parent.appendChild(createElement(action.node));
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

    apply(root.parentElement as HTMLElement, [diff]);

    vnode = newVnode;
}

export function render(newTree: JSX.Element, mount: HTMLElement | null): void {
    if (mount === null) {
        throw new Error('Root element is null');
    }

    vnode = createVNode(tree, 'root');
    root = createElement(vnode) as HTMLElement;
    mount.appendChild(root);

    const newVnode = createVNode(newTree, 'root');
    const diff = diffElement(vnode, newVnode);

    apply(root.parentElement as HTMLElement, [diff]);

    tree = newTree;
    vnode = newVnode;
}
