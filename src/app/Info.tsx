import { h, fragment } from '@/jsx/jsx';

import { Title } from './Title';
import { useState } from '@/jsx/hook';

export function Info(): JSX.Element {
    const title = 'list';
    const [counter, setCounter] = useState(0);

    function handleClick() {
        setCounter(counter + 1);
    }

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
                <p>{counter}</p>
                <button onClick={handleClick}>Click me</button>
            </div>
        </>
    );
}
