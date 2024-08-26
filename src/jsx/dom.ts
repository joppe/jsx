import { VNode } from './node';

export function isEvent(prop: string): boolean {
    return prop.indexOf('on') === 0;
}

export function getEventName(prop: string): string {
    return prop.slice(2).toLowerCase();
}

export function addProperties(
    element: HTMLElement,
    props: Record<string, any>,
): void {
    for (const [key, value] of Object.entries(props)) {
        if (isEvent(key)) {
            const event = getEventName(key);

            element.addEventListener(event, value as EventListener);
        } else {
            element.setAttribute(key, value);
        }
    }
}

export function removeProperties(
    element: HTMLElement,
    props: Record<string, any>,
): void {
    for (const [key, value] of Object.entries(props)) {
        if (isEvent(key)) {
            const event = getEventName(key);

            element.removeEventListener(event, value as EventListener);
        } else {
            element.removeAttribute(key);
        }
    }
}

export function createTextElement(text: string): Text {
    return document.createTextNode(text);
}

export function createFragmentElement(): DocumentFragment {
    return document.createDocumentFragment();
}

export function createHTMLElement(tag: string): HTMLElement {
    return document.createElement(tag);
}
