export function h(
    tag: keyof HTMLElementTagNameMap | JSX.FunctionComponent | string,
    props: Record<string, any> | null,
    ...children: (JSX.Element | string)[]
): JSX.Element {
    return { tag, props: props ?? {}, children };
}

export const fragment = Symbol('fragment');
