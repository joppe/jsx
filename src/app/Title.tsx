import { h } from '@/jsx/jsx';

type TitleProps = {
    title: string;
    count: number;
};

export function Title({ title, count }: TitleProps): JSX.Element {
    const color = count > 10 ? 'red' : count < 0 ? 'red' : 'green';

    return <h1 style={`font-size: 24px; color: ${color};`}>{title}</h1>;
}
