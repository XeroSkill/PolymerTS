// PolymerTS - Polymer for TypeScript
//
// https://github.com/nippur72/PolymerTS
//
// Antonino Porcino, nino.porcino@gmail.com

/// <amd-module name="src/polymerTS/polymer-ts"/>

const POLYMER_TS = `PolymerTS`;
const BASE = `Base`;

//Custom methods
const CREATE = `create`;
const REGISTER = `register`;
const CUSTOM_CONSTRUCTOR = `$custom_cons`;
const CUSTOM_CONSTRUCTOR_ARGS = `$custom_cons_args`;

//Polymer methods
const FACTORY_IMPL = `factoryImpl`;
const ATTACHED = `attached`;

//Other
// Had to index the extends property by string to get around a YUI compressor issue..
const EXTENDS = `extends`;


// create an ES6 inheritable Polymer.Base object, referenced as "polymer.Base"
function createEs6PolymerBase() {
    // create a placeholder class
    let polymerBaseClass = function () {
    };

    if (!window[POLYMER_TS]) {
        window[POLYMER_TS] = {};
    }

    // make it available as polymer.Base
    window[POLYMER_TS][BASE] = polymerBaseClass;

    // add a default create method()
    polymerBaseClass[CREATE] = function () {
        throw "element not yet registered in Polymer";
    };

    // add a default create method()
    polymerBaseClass[REGISTER] = function (dontRegister?: boolean) {
        if (dontRegister === true) {
            createClass(this);
        } else {
            createElement(this);
        }
    }
}

function prepareForRegistration(elementClass: Function): PolymerTS.Element {
    // copies members from inheritance chain to Polymer object
    function copyMembers(dest: Object, source) {
        if (source === undefined || source === null) return;

        Object.keys(source).map((member) => {
            // copy only if has not been defined
            if (!dest.hasOwnProperty(member)) {
                dest[member] = source[member];
            }
        });
        copyMembers(dest, source.__proto__);
    }

    // backward compatibility with TypeScript 1.4 (no decorators)
    if (elementClass.prototype.is === undefined) {
        let proto = elementClass.prototype;
        let instance = new (<any>elementClass)();

        if (!instance.is) {
            throw new Error("no name for " + elementClass);
        }

        proto.is = instance.is;
        if (instance[EXTENDS]) {
            proto[EXTENDS] = instance[EXTENDS];
        }
        if (instance.properties) {
            proto.properties = instance.properties;
        }
        if (instance.listeners) {
            proto.listeners = instance.listeners;
        }
        if (instance.observers) {
            proto.observers = instance.observers;
        }
        if (instance.behaviors) {
            proto.behaviors = instance.behaviors;
        }
        if (instance.hostAttributes) {
            proto.hostAttributes = instance.hostAttributes;
        }
        if (instance.style) {
            proto.style = instance.style;
        }
        if (instance.template) {
            proto.template = instance.template;
        }
    }

    let preparedElement = elementClass.prototype;

    // artificial constructor: call constructor() and copies members
    preparedElement[CUSTOM_CONSTRUCTOR] = function () {
        // reads arguments coming from factoryImpl
        let args = this.$custom_cons_args;

        // applies class constructor on the polymer element (this)
        elementClass.apply(this, args);
    };

    // arguments for artificial constructor
    preparedElement[CUSTOM_CONSTRUCTOR_ARGS] = [];

    //TODO - Get rid of this, We want to preserve legacy method
    //Modify factoryimpl method to call custom constructor
    if (preparedElement[FACTORY_IMPL] !== undefined) {
        throw `do not use ${FACTORY_IMPL}() use constructor() instead`;
    } else {
        preparedElement[FACTORY_IMPL] = function () {
            this.$custom_cons_args = arguments;
        };
    }

    //TODO - Get rid of this, We want to preserve legacy method
    // modify "attached" event function Invoke custom constructor instead
    let oldFunction = preparedElement[ATTACHED];
    preparedElement[ATTACHED] = function () {
        this.$custom_cons();
        if (oldFunction !== undefined) {
            oldFunction.apply(this);
        }
    };

    // copy inherited class members
    copyMembers(preparedElement, elementClass.prototype.__proto__);

    //putting string in prototype.style in decorator style makes it impossible to access and modify css styles of created elements
    //so it needs to be deleted in order to access and modify styles
    delete preparedElement["style"];

    return preparedElement;
}

// a version that works in IE11 too
function createDomModule(definition: PolymerTS.Element) {
    let domModule = document.createElement('dom-module');

    let proto = <any> definition.prototype;

    domModule.id = proto.is;

    let html = "";
    let style = "";
    if (proto.style !== undefined) style = `<style>${proto.style}</style>`;
    if (proto.template !== undefined) html = `<template>${style}${proto.template}</template>`;

    domModule.innerHTML = html;

    (<any> domModule).createdCallback();
}

function createElement<T extends PolymerTS.Base>(element: new (...args: any[]) => T): new (...args: any[]) => T {
    if (isRegistered(element)) {
        throw "element already registered in Polymer";
    }

    if ((<PolymerTS.PolymerTSElement>(element.prototype)).template !== undefined || (<PolymerTS.PolymerTSElement>(element.prototype)).style !== undefined) {
        createDomModule(element);
    }

    // register element and make available its constructor as "create()"
    let maker = <any> Polymer(prepareForRegistration(element));
    element[CREATE] = function () {
        let newOb = Object.create(maker.prototype);
        return maker.apply(newOb, arguments);
    };
    return maker;
}

function createClass<T extends PolymerTS.Base>(element: new (...args: any[]) => T): new (...args: any[]) => T {
    if (isRegistered(element)) {
        throw "element already registered in Polymer";
    }

    if ((<PolymerTS.PolymerTSElement>(element.prototype)).template !== undefined || (<PolymerTS.PolymerTSElement>(element.prototype)).style !== undefined) {
        createDomModule(element);
    }

    // register element and make available its constructor as "create()"
    let maker = <any> Polymer.Class(prepareForRegistration(element));
    element[CREATE] = function () {
        let newOb = Object.create(maker.prototype);
        return maker.apply(newOb, arguments);
    };
    return maker;
}

function isRegistered(element: PolymerTS.Element) {
    return (<PolymerTS.PolymerTSElement>(element.prototype)).$custom_cons !== undefined;
}

// modifies Polymer.Base and makes it available as an ES6 class named polymer.Base
createEs6PolymerBase();



