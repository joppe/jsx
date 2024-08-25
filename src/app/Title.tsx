import { h } from '@/jsx/jsx';

type TitleProps = {
    title: string;
};

export function Title({ title }: TitleProps): JSX.Element {
    return <h1 onClick={() => console.log('foo')}>{title}</h1>;
}
