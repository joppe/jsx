export function h(
    tag: string,
    props: Record<string, any>,
    ...children: any
): void {
    console.log(tag, props, children);
}

export function fragment(...a: unknown[]) {
    console.log(a);
}
