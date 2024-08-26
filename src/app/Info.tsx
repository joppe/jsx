import { h, fragment } from '@/jsx/jsx';

import { Title } from './Title';
import { useState } from '@/jsx/hook';

export function Info(): JSX.Element {
    const title = 'Counter';
    const [counter, setCounter] = useState(0);

    function increment() {
        setCounter(counter + 1);
    }

    function decrement() {
        setCounter(counter - 1);
    }

    return (
        <>
            <div data-test="root">
                <Title title={title} count={counter} />
                <p>Lorem</p>
                <ul className="foo">
                    <li>first</li>
                    <li>2</li>
                    <li>third</li>
                </ul>
                <div style="display: flex; gap: 10px">
                    <button onClick={decrement}>-</button>
                    {counter}
                    <button onClick={increment}>+</button>
                </div>
            </div>
        </>
    );
}
