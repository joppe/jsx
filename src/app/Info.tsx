import { h, fragment } from '@/jsx/jsx';

import { Title } from './Title';

export function Info(): JSX.Element {
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
