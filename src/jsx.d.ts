type Events = {
    onClick: (event: MouseEvent) => void;
};

declare namespace JSX {
    type Element = {
        tag:
            | keyof HTMLElementTagNameMap
            | JSX.FunctionComponent
            | Symbol
            | string;
        props: Record<string, unknown>;
        children: (JSX.Element | string)[];
    };

    type FunctionComponent = (props: Record<string, unknown>) => JSX.Element;

    type IntrinsicElements = {
        [P in keyof HTMLElementTagNameMap]: Omit<
            Partial<HTMLElementTagNameMap[P]>,
            'style'
        > &
            Partial<Events> & {
                style?: string;
            };
    };
}
