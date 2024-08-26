import { hook } from './hook';
import { fragment } from './jsx';

export type VTextNode = {
    text: string;
};

export type VFragment = {
    children: VNode[];
};

export type VElement = {
    tag: keyof HTMLElementTagNameMap;
    props: Record<string, any>;
    children: VNode[];
};

export type VNode = VElement | VTextNode | VFragment;

export function createVNode(element: JSX.Element, key: string): VNode {
    if (typeof element.tag === 'function') {
        const el = hook(element.tag, element.props, key);

        return createVNode(el, `${key}-0`);
    }

    const children = element.children.map((child, i) => {
        if (typeof child === 'object') {
            return createVNode(child as JSX.Element, `${key}-${i}`);
        }

        return {
            text: child,
        };
    });

    if (element.tag === fragment) {
        return { children };
    }

    return {
        tag: element.tag as keyof HTMLElementTagNameMap,
        props: element.props,
        children,
    };
}
