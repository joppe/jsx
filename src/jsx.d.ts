type Events = {
    onClick: (event: MouseEvent) => void;
};

declare namespace JSX {
    type Element = {
        tag: keyof HTMLElementTagNameMap;
        props: Record<string, unknown>;
        children: Element[];
    };
    type IntrinsicElements = {
        [P in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[P]> &
            Partial<Events>;
    };
}
