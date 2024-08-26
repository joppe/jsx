import { rerender } from './render';

export type RegistryEntry = {
    value: any;
};

export type Registry = {
    activeKey: string | undefined;
    activeIndex: number;
    registry: Record<string, RegistryEntry[]>;
};

const registry: Registry = {
    activeKey: undefined,
    activeIndex: -1,
    registry: {},
};

export function hook(
    fn: JSX.FunctionComponent,
    props: Record<string, any>,
    key: string,
) {
    registry.activeKey = key;

    const el = fn(props);

    registry.activeKey = undefined;
    registry.activeIndex = -1;

    return el;
}

export function useState<T>(initialValue: T) {
    registry.activeIndex += 1;

    const key = registry.activeKey as string;
    const index = registry.activeIndex;

    if (!registry.registry[key]) {
        registry.registry[key] = [];
    }

    if (registry.activeIndex >= registry.registry[key].length) {
        registry.registry[key].push({
            value: initialValue,
        });
    }

    return [
        registry.registry[key][index].value,
        (newValue: T) => {
            registry.registry[key][index].value = newValue;
            rerender();
        },
    ] as const;
}
