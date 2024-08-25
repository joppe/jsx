import { fragment } from './jsx';

export type VTextNode = {
    text: string;
};

export type VFragment = {
    children: VNode[];
};

export type VElement = {
    tag: keyof HTMLElementTagNameMap;
    props: Record<string, string>;
    children: VNode[];
};

export type VNode = VElement | VTextNode | VFragment;

let activeKey: string | undefined;

export function createVNode(element: JSX.Element, key: string): VNode {
    if (typeof element.tag === 'function') {
        activeKey = key;
        const el = element.tag(element.props);
        activeKey = undefined;

        return createVNode(el, `${key}-0`);
    }

    const children = element.children.map((child, i) => {
        if (typeof child === 'string') {
            return {
                text: child,
            };
        }

        return createVNode(child as JSX.Element, `${key}-${i}`);
    });

    if (element.tag === fragment) {
        return { children };
    }

    return {
        tag: element.tag as keyof HTMLElementTagNameMap,
        props: element.props as Record<string, string>,
        children,
    };
}
