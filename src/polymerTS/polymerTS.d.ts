/**
 * @file - Splitting off the module types into a separate d.ts to remove the 'noise'
 * from the actual polymer-ts files.
 *
 * Also caused a build issue at work
 */

declare module PolymerTS {
    // this is the original Polymer.Base
    export class PolymerBase extends HTMLElement {
        $: any;
        $$: any;

        root: HTMLElement;
        shadyRoot: HTMLElement;
        style: CSSStyleDeclaration;
        customStyle: { [property: string]: string; };

        arrayDelete(path: string, item: string | any): any;

        async(callback: Function, waitTime?: number): any;

        attachedCallback(): void;

        attributeFollows(name: string, toElement: HTMLElement, fromElement: HTMLElement): void;

        cancelAsync(handle: number): void;

        cancelDebouncer(jobName: string): void;

        classFollows(name: string, toElement: HTMLElement, fromElement: HTMLElement): void;

        create(tag: string, props?: Object): HTMLElement;

        debounce(jobName: string, callback: Function, wait?: number): void;

        deserialize(value: string, type: any): any;

        distributeContent(): void;

        domHost(): void;

        elementMatches(selector: string, node: Element): any;

        fire(type: string, detail?: Object, options?: FireOptions): any;

        flushDebouncer(jobName: string): void;

        get (path: string | Array<string | number>): any;

        getContentChildNodes(slctr: string): any;

        getContentChildren(slctr: string): any;

        getNativePrototype(tag: string): any;

        getPropertyInfo(property: string): any;

        importHref(href: string, onload?: Function, onerror?: Function, optAsync?: boolean): any;

        instanceTemplate(template: any): any;

        isDebouncerActive(jobName: string): any;

        linkPaths(to: string, from: string): void;

        listen(node: Element, eventName: string, methodName: string): void;

        mixin(target: Object, source: Object): void;

        notifyPath(path: string, value: any, fromAbove?: any): void;

        notifySplices(path: string, splices: { index: number, removed: Array<any>, addedCount: number, object: Array<any>, type: "splice" }[]): void;

        pop(path: string): any;

        push(path: string, value: any): any;

        reflectPropertyToAttribute(name: string): void;

        resolveUrl(url: string): any;

        scopeSubtree(container: Element, shouldObserve: boolean): void;

        serialize(value: string): any;

        serializeValueToAttribute(value: any, attribute: string, node: Element): void;

        set (path: string | Array<string | number>, value: any, root?: Object): any;

        setScrollDirection(direction: string, node: HTMLElement): void;

        shift(path: string, value: any): any;

        splice(path: string, start: number, deleteCount: number, ...items): any;

        toggleAttribute(name: string, bool: boolean, node?: HTMLElement): void;

        toggleClass(name: string, bool: boolean, node?: HTMLElement): void;

        transform(transform: string, node?: HTMLElement): void;

        translate3d(x, y, z, node?: HTMLElement): void;

        unlinkPaths(path: string): void;

        unlisten(node: Element, eventName: string, methodName: string): void;

        unshift(path: string, value: any): any;

        updateStyles(): void;
    }

    export interface dom {
        (node: HTMLElement): HTMLElement;

        (node: PolymerTS.Base): HTMLElement;

        flush();
    }

    // options for the fire method
    export interface FireOptions {
        node?: HTMLElement | PolymerTS.Base;
        bubbles?: boolean;
        cancelable?: boolean;
    }

    // members that can be optionally implemented in an element
    export interface Element {
        properties?: Object;
        listeners?: Object;
        behaviors?: Object[];
        observers?: String[];

        // lifecycle
        factoryImpl?(...args): void;

        ready?(): void;

        created?(): void;

        attached?(): void;

        detached?(): void;

        attributeChanged?(attrName: string, oldVal: any, newVal: any): void;

        //
        prototype?: Object;
    }

    // members set by PolymerTS
    export interface PolymerTSElement {
        $custom_cons?: FunctionConstructor;
        $custom_cons_args?: any[];
        template?: string;
        style?: string;
    }

    // property definition interface
    export interface Property {
        name?: string;
        type?: any;
        value?: any;
        reflectToAttribute?: boolean;
        readOnly?: boolean;
        notify?: boolean;
        computed?: string;
        observer?: string;
    }

    // the ES6-inheritable version of Polymer.Base
    export class Base extends PolymerTS.PolymerBase implements PolymerTS.Element {
        properties: Object;
        listeners: Object;
        behaviors: Object[];
        observers: String[];
        prototype: Object;

        static create<T extends PolymerTS.Base>(...args: any[]): T;

        static register(): void;

        is: string;
    }
}

// Polymer object
declare let Polymer: {
    (prototype: PolymerTS.Element): FunctionConstructor;
    Class(prototype: PolymerTS.Element): Function;
    dom: PolymerTS.dom;
    appendChild(node: HTMLElement): HTMLElement;
    insertBefore(node: HTMLElement, beforeNode: HTMLElement): HTMLElement;
    removeChild(node: HTMLElement): HTMLElement;
    updateStyles(): void;

    Base: any;
};