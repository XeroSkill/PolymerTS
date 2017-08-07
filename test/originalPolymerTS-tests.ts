/**
 * Original Polymer TS tests that have been adapted to be run in karma
 * A few 'any' tags have been added to make the TSC compiler happy (2.4.1)
 */
/// <amd-module name="test/originalPolymerTS-tests"/>

import "./elements/simpleElements";

// simulates the old Jasmine 1.3 waitsFor()
function waitFor(F)
{
    beforeEach((done) => {
        setInterval(() => {
            if(F()) done();
        }, 250);
    });
}

function querySelector(s)
{
    return document.querySelector(s);
}

// quickly checks if instance implementsElement the class
function implementsElement(instance: Object, classFunction: Function)
{
    var instanceMembers = {};
    for(var i in instance) instanceMembers[i] = true;

    var classMembers = [];
    for(var i in classFunction.prototype) classMembers.push(i);

    for(var t=0; t<classMembers.length; t++)
    {
        if(instanceMembers[classMembers[t]]===undefined)
        {
            return false;
        }
    }
    return true;
}

describe(`Original Polymer TS Tests`, ()=> {

    let container: HTMLElement;
    let testFixture: HTMLElement;

    beforeAll((done) => {
        container = document.createElement(`div`);
        testFixture = document.createElement(`original-polymer-ts-tests`);

        container.appendChild(testFixture);
        document.body.appendChild(container);
        setTimeout(done, 0);
    });

    afterAll(()=>{
        document.body.removeChild(container);
    });

    describe("@component decorator", () => {
        it('registers regular elements', () => {
            var el = <TestElement> querySelector('#testElement');
            expect(implementsElement(el, TestElement)).toBe(true);
            expect(el.is).toBe(TestElement.prototype["is"]);
            expect(el.$.inner.innerHTML).toBe("innerelement");
        });

        it('extends builtin elements using second argument', () => {
            var el = querySelector('#testInput1');
            expect(implementsElement(el, TestInput1)).toBe(true);
        });

        it("sets 'is:' correctly", () => {
            var el1 = <TestElement> querySelector('#testElement');
            var el2 = <TestInput1>  querySelector('#testInput1');
            var el3 = <TestInput2>  querySelector('#testInput2');
            expect(el1.is).toBe(TestElement.prototype["is"]);
            expect(el2.is).toBe(TestInput1.prototype["is"]);
            expect(el3.is).toBe(TestInput2.prototype["is"]);
        });
    });

    describe("@extend decorator", () => {
        it('extends builtin elements', () => {
            var el = querySelector('#testInput2');
            expect(implementsElement(el, TestInput2)).toBe(true);
        });
    });

    describe("a computed property", () =>
    {
        it('can be set with @computed decorator', () => {
            var element = <ComputedPropertiesTest> querySelector('#computedProperties1');

            expect(element.computed1).toBe(2);
            element.set('first', 2);
            expect(element.computed1).toBe(3);
            element.set('second', 4);
            expect(element.computed1).toBe(6);

            // TODO check for "get_"
        });

        it('can be set with @property decorator', () => {
            var element = <ComputedPropertiesTest> querySelector('#computedProperties2');

            expect(element.computed2).toBe(2);
            element.set('first', 2);
            expect(element.computed2).toBe(3);
            element.set('second', 4);
            expect(element.computed2).toBe(6);
        });
    });

    describe("custom constructor", () =>
    {
        var el: CustomConstructorTest;

        beforeEach(() =>
        {
            // create the element
            el = <any> CustomConstructorTest.create("42");

            // connect it to DOM
            querySelector("#put_custom_constructor_here").appendChild(el);
        });

        // wait for the 'attached' event
        waitFor(() => (el.bar == "42"));

        it("provides custom initialization", () =>
        {
            expect(el.bar).toBe("42");
        });
    });

    describe("polymer.Base", () => {
        it("doesn't allow an element to be used before it's registered", () => {
            expect(()=>UnInitializedTest.create()).toThrow("element not yet registered in Polymer");
        });

        it("doesn't allow an element to be registered twice", () => {
            expect(() => DoubleInitializationTest.register() ).not.toThrow();
            expect(() => DoubleInitializationTest.register() ).toThrow("element already registered in Polymer");
        });

        it("create elements that are extensions of HTMLElement", () => {
            var el = DoubleInitializationTest.create();
            expect(implementsElement(el, HTMLElement)).toBe(true);
        });

        it("create elements that are extensions Polymer.Base", () => {
            var el=DoubleInitializationTest.create();
            expect(implementsElement(el, Polymer.Base)).toBe(true);
        });

        it("does not allow to redefine factoryImpl()", () => {
            expect(() => NoFactoryImplTest.register()).toThrow("do not use factoryImpl() use constructor() instead");
        });
    });

    describe("@listen decorator", () => {
        var el: ListenerTest;

        beforeEach(() => {
            el = <any> ListenerTest.create();
            querySelector("#put_custom_constructor_here").appendChild(el);
        });

        // wait for the 'attached' event
        waitFor(() => (el.bar=="foo"));

        it("sets an event listener function", () => {
            expect(el.bar).toBe("foo");
        });
    });

    describe("@observe decorator", () => {
        var el: ObserverTest;

        beforeEach(() => {
            el = <any> ObserverTest.create();
            querySelector("#put_custom_constructor_here").appendChild(el);
        });

        // wait for the 'attached' event
        waitFor(() => (el.bar=="mybar"));

        it("observes a single property changes", () => {
            expect((<ObserverTest>el).nbar_changed).toBe(0);
            expect((<ObserverTest>el).nbar_foo_changed).toBe(0);
            el.set("bar", "42");
            expect((<ObserverTest>el).nbar_changed).toBe(1);
            expect((<ObserverTest>el).nbar_foo_changed).toBe(1);
        });

        it("observes a single property changes as a lambda function", () => {
            expect((<ObserverTest>el).nbaz_changed).toBe(0);
            el.set("baz", "42");
            expect((<ObserverTest>el).nbaz_changed).toBe(1);
        });

        it("observes more than one property changes", () => {
            expect((<ObserverTest>el).nbar_changed).toBe(0);
            expect((<ObserverTest>el).nbar_foo_changed).toBe(0);
            el.set("foo", "42");
            expect((<ObserverTest>el).nbar_changed).toBe(0);
            expect((<ObserverTest>el).nbar_foo_changed).toBe(1);
        });

        it("observes subproperties (path) changes", () => {
            //expect((<ObserverTest>el).nmanager_changed).toBe(0);
            el.set("user.manager", "42");
            expect((<ObserverTest>el).user.manager).toBe("42");
            //expect((<ObserverTest>el).nmanager_changed).toBe(1);
            expect((<ObserverTest>el).nmanager_changed).toBeGreaterThan(0);
        });
    });

    describe("@behavior decorator", () => {
        var el1: BehaviorTest1,
            el2: BehaviorTest2;

        beforeEach(() => {
            el1 = <any> BehaviorTest1.create();
            el2 = <any> BehaviorTest2.create();
            querySelector("#put_custom_constructor_here").appendChild(el1);
            querySelector("#put_custom_constructor_here").appendChild(el2);
        });

        // wait for the 'attached' event
        waitFor(() => (el1.bar=="mybar"));

        it("mixes code from another class (decorating the 'class' keyword)", () => {
            expect(el1.hasfired).toBe(true);
            expect(<any>el1.methodInBase()).toBe("this method is defined in BehaviorBaseTest");
            expect(<any>el1.methodInChild()).toBe("this method is defined in BehaviorBaseTest");
        });

        // wait for the 'attached' event
        waitFor(() => (el2.bar=="mybar"));

        it("mixes code from another class (decorator inside the class body)", () => {
            expect(el2.hasfired).toBe(true);
            expect(<any>el1.methodInBase()).toBe("this method is defined in BehaviorBaseTest");
            expect(<any>el1.methodInChild()).toBe("this method is defined in BehaviorBaseTest");
        });

        it("mixes code from a plain javascript object (decorating the 'class' keyword)", () => {
            expect(el1.methodInPojo1()).toEqual("pojo");
        });

        it("mixes code from a plain javascript object (decorator inside the class body)", () => {
            expect(el1.methodInPojo2()).toEqual("pojo");
        });
    });

    describe("@template/@style decorators", () => {
        var el: TemplateTest;

        beforeEach(() => {
            el = <any> TemplateTest.create();
            querySelector("#put_test_elements_here").appendChild(el);
        });

        // wait for the 'attached' event
        waitFor(() => (el.bar=="mybar"));

        it("provide a template for the element", () => {
            expect(el.$.inner.innerHTML).toBe("inner text");
        });

        it("provide a style for the element", () => {
            expect(el.$.inner.clientWidth).toBe(50);
        });
    });

    describe("@hostAttributes decorator", () => {
        var el: HostAttributesTest;

        beforeEach(() => {
            el = <any> HostAttributesTest.create();
            querySelector("#put_test_elements_here").appendChild(el);
        });

        // wait for the 'attached' event
        waitFor(() => (el.bar=="mybar"));

        it("sets attributes on the host element", () => {
            expect(el.style.color).toBe("red");
        });
    });

    describe("element class", () => {
        var el: ExtendedElementTest;

        beforeEach(() => {
            el = <any> ExtendedElementTest.create();
            querySelector("#put_test_elements_here").appendChild(el);
        });

        // wait for the 'attached' event
        waitFor(() => (el.bar=="mybar"));

        it("can be extended with 'extends'", () => {
            expect(el.prop).toBe("AB");
        });

        it("can be mixed with TypeScript mixins", () => {
            expect(el.pmix).toBe("C");
        });

        it("can be extended with multiple level inheritance", () => {
            expect(el.qmix).toBe("12");
            expect(el.is).toEqual("extended-element-test");
        });
    });
});