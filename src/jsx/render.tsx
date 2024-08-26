import { Action, ActionType, diffElement } from './diff';
import { addProperties, createElement, removeProperties } from './dom';
import { createVNode, VNode } from './node';

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
