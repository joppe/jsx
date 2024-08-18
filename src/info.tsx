/* @jsx h */
import { h, fragment } from './h';

type TitleProps = {
    title: string;
};

export function Title({ title }: TitleProps): JSX.Element {
    return <h1 onClick={() => console.log('foo')}>{title}</h1>;
}

export function Foo() {
    const title = 'list';

    return (
        <>
            <div data-test="root">
                <Title title={title} />
                <p>Lorem</p>
                <ul className="foo">
                    <li>first</li>
                    <li>2</li>
                    <li>third</li>
                </ul>
            </div>
        </>
    );
}
