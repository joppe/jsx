import { VNode } from './node';

export enum ActionType {
    NO_ACTION = 'NO_ACTION',
    REPLACE = 'REPLACE',
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
    REMOVE = 'REMOVE',
}
export type NoAction = {
    type: ActionType.NO_ACTION;
};

export type ReplaceAction = {
    type: ActionType.REPLACE;
    node: VNode;
};
export type UpdateAction = {
    type: ActionType.UPDATE;
    remove: string[];
    set: Record<string, string>;
    children: Action[];
};

export type CreateAction = {
    type: ActionType.CREATE;
    node: VNode;
};

export type RemoveAction = {
    type: ActionType.REMOVE;
};

export type Action =
    | NoAction
    | ReplaceAction
    | UpdateAction
    | CreateAction
    | RemoveAction;

export function diffChildren(
    oldChildren: VNode[],
    newChildren: VNode[],
): Action[] {
    const length = Math.max(oldChildren.length, newChildren.length);

    return Array.from({ length }, (_, i) => {
        if (oldChildren[i] === undefined) {
            return {
                type: ActionType.CREATE,
                node: newChildren[i],
            };
        }

        if (newChildren[i] === undefined) {
            return {
                type: ActionType.REMOVE,
            };
        }

        return diffElement(oldChildren[i], newChildren[i]);
    });
}

export function diffElement(oldEl: VNode, newEl: VNode): Action {
    if ('text' in oldEl) {
        if ('text' in newEl && oldEl.text !== newEl.text) {
            return {
                type: ActionType.NO_ACTION,
            };
        } else {
            return {
                type: ActionType.REPLACE,
                node: newEl,
            };
        }
    }

    if ('tag' in oldEl && 'tag' in newEl && oldEl.tag !== newEl.tag) {
        return {
            type: ActionType.REPLACE,
            node: newEl,
        };
    }

    const remove: string[] = [];

    if ('props' in oldEl) {
        for (const prop in oldEl.props) {
            if (!('props' in newEl && prop in newEl.props)) {
                remove.push(prop);
            }
        }
    }

    const set: Record<string, string> = {};

    if ('props' in newEl) {
        for (const [key, value] of Object.entries(newEl.props)) {
            if (!('props' in oldEl) || newEl.props[key] !== oldEl.props[key]) {
                set[key] = value as string;
            }
        }
    }

    const children = diffChildren(
        oldEl.children,
        'children' in newEl ? newEl.children : [],
    );

    return {
        type: ActionType.UPDATE,
        remove,
        set,
        children,
    };
}
