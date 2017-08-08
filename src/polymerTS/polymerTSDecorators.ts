/// <amd-module name="src/polymerTS/polymerTSDecorators"/>

//Side affect import to trigger the PolymerTS registration to the global object
import "./polymer-ts";

/**
 * @component decorator
 * @param {string} tagname
 * @param {string} extendsTag
 * @returns {(target: Function) => any}
 */
export function component(tagname: string, extendsTag?: string) {
    return function(target: Function) {
        target.prototype["is"] = tagname;
        if (extendsTag !== undefined)
        {
            target.prototype["extends"] = extendsTag;
        }
    }
}

/**
 * @extend decorator
 * @param {string} tagname
 * @returns {(target: Function) => any}
 */
export function extend(tagname: string) {
    return (target: Function) => {
        target.prototype["extends"] = tagname;
    }
}

/**
 * @template decorator
 * @param {string} templateString
 * @returns {(target: Function) => any}
 */
export function template(templateString: string) {
    return (target: Function) => {
        target.prototype["template"] = templateString;
    }
}

/**
 * @style decorator
 * @param {string} styleString
 * @returns {(target: Function) => any}
 */
export function style(styleString: string) {
    return (target: Function) => {
        target.prototype["style"] = styleString;
    }
}

/**
 * @hostAttributes decorator
 * @param {Object} attributes
 * @returns {(target: Function) => any}
 */
export function hostAttributes(attributes: Object) {
    return (target: Function) => {
        target.prototype["hostAttributes"] = attributes;
    }
}

/**
 * @property decorator
 * @param {polymer.Property} ob
 * @returns {(target: polymer.Element, propertyKey: string) => any}
 */
export function property(ob?: PolymerTS.Property) {
    return (target: PolymerTS.Element, propertyKey: string) => {
        target.properties = target.properties || {};
        if (typeof (target[propertyKey]) === "function") {
            // property is function, treat it as a computed property
            var params = ob["computed"];
            var getterName = "get_computed_" + propertyKey;
            ob["computed"] = getterName + "(" + params + ")";
            target.properties[propertyKey] = ob;
            target[getterName] = target[propertyKey];
        }
        else {
            // normal property
            target.properties[propertyKey] = ob || {};
        }
    }
}

/**
 * @computed decorator
 * @param {polymer.Property} ob
 * @returns {(target: polymer.Element, computedFuncName: string) => any}
 */
export function computed(ob?: PolymerTS.Property) {
    return (target: PolymerTS.Element, computedFuncName: string) => {
        target.properties = target.properties || {};
        var propOb = ob || {};
        var getterName = "get_computed_" + computedFuncName;
        var funcText: string = target[computedFuncName].toString();
        var start = funcText.indexOf("(");
        var end = funcText.indexOf(")");
        var propertiesList = funcText.substring(start+1,end);
        propOb["computed"] = getterName + "(" + propertiesList + ")";
        target.properties[computedFuncName] = propOb;
        target[getterName] = target[computedFuncName];
    }
}

/**
 * @listend decorator
 * @param {string} eventName
 * @returns {(target: polymer.Element, propertyKey: string) => any}
 */
export function listen(eventName: string) {
    return (target: PolymerTS.Element, propertyKey: string) => {
        target.listeners = target.listeners || {};
        target.listeners[eventName] = propertyKey;
    }
}

/**
 * @behaviour decorator
 * @param behaviorObject
 * @returns {any}
 */
export function behavior(behaviorObject: any): any {
    return (target: any) => {
        if (typeof (target) === "function") {
            // decorator applied externally, target is the class object
            target.prototype["behaviors"] = target.prototype["behaviors"] || [];
            let beObject = behaviorObject.prototype === undefined ? behaviorObject : behaviorObject.prototype;
            target.prototype["behaviors"].push(beObject);
        }
        else {
            // decorator applied internally, target is class.prototype
            target.behaviors = target.behaviors || [];
            let beObject = behaviorObject.prototype === undefined ? behaviorObject : behaviorObject.prototype;
            target.behaviors.push(beObject);
        }
    }
}

/**
 * observer decorator
 * @param {string} observedProps
 * @returns {(target: polymer.Element, observerFuncName: string) => any}
 */
export function observe(observedProps: string) {
    return (target: PolymerTS.Element, observerFuncName: string) => {
        target.observers = target.observers || [];
        target.observers.push(observerFuncName + "(" + observedProps + ")");
    }
}