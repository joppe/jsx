import { h } from '@/jsx/jsx';

type TitleProps = {
    title: string;
};

export function Title({ title }: TitleProps): JSX.Element {
    return <h1 style="font-size: 24px; color: blue;">{title}</h1>;
}
