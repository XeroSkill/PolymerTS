/// <amd-module name="test/originalPolymerTSElements/test_components"/>
import * as Polymer from "../../src/polymerTS/polymerTSDecorators";

@Polymer.component("computed-properties-test")
export class ComputedPropertiesTest extends PolymerTS.Base
{
   @Polymer.property() first  = 1;
   @Polymer.property() second = 1;

   @Polymer.computed() computed1(first, second)
   {
      return first + second;
   }

   @Polymer.property({ computed: 'getcomputed2(first,second)' })
   computed2: number;

   getcomputed2()
   {
      return this.first + this.second;
   }
}

ComputedPropertiesTest.register();

@Polymer.component("custom-constructor-test")
@Polymer.template("<div>this element has a custom constructor</div>")
export class CustomConstructorTest extends PolymerTS.Base
{
   @Polymer.property() bar: string;

   constructor(foo: string)
   {
      super();
      this.bar = foo;
   }
}

CustomConstructorTest.register();

@Polymer.component("property-initialization-test")
@Polymer.template("")
export class PropertyInitializationTest extends PolymerTS.Base {
   @Polymer.property() bar = "mybar"

   @Polymer.property() foo: string;

   @Polymer.property({ value: "mywar" }) war;

   constructor() {
      super();
      this.foo = "myfoo";
   }
}

PropertyInitializationTest.register();

@Polymer.component("double-initialization-test")
@Polymer.template("")
export class DoubleInitializationTest extends PolymerTS.Base {
   @Polymer.property() bar="mybar"

   @Polymer.property() foo: string;

   @Polymer.property({ value: "mywar" }) war;

   constructor() {
      super();
      this.foo="myfoo";
   }
}

@Polymer.component("uninitialized-test")
@Polymer.template("")
export class UnInitializedTest extends PolymerTS.Base
{
   @Polymer.property() bar = "mybar"
}

@Polymer.component("no-factory-impl-test")
@Polymer.template("")
export class NoFactoryImplTest extends PolymerTS.Base
{
   factoryImpl()
   {
      return null;
   }
}

@Polymer.component("listener-test")
@Polymer.template("")
export class ListenerTest extends PolymerTS.Base
{
   @Polymer.property() bar="mybar";

   constructor() {
      super();
      this.fire("change-bar");
   }

   @Polymer.listen("change-bar")
   changeBarEvent()
   {
      this.bar = "foo";
   }
}

ListenerTest.register();

@Polymer.component("observer-test")
@Polymer.template("")
export class ObserverTest extends PolymerTS.Base {
   @Polymer.property() bar="mybar";
   @Polymer.property() foo="myfoo";
   @Polymer.property() baz="mybaz";
   @Polymer.property() nbar_changed = 0;
   @Polymer.property() nbaz_changed = 0;
   @Polymer.property() nbar_foo_changed = 0;
   @Polymer.property() nmanager_changed = 0;

   @Polymer.property({type: Object}) user = { manager: "64" };

   @Polymer.observe("bar")
   changedBar() {
      this.nbar_changed++;
   }

   @Polymer.observe("baz")
   changedBaz = (newVal, OldVal) => {
      this.nbaz_changed++;
   }

   @Polymer.observe("bar,foo")
   changedBarAndFoo() {
      this.nbar_foo_changed++;
   }

   @Polymer.observe("user.manager")
   changedManager(newVal) {
      this.nmanager_changed++;
   }
}

ObserverTest.register();

export class BehaviorBaseTest extends PolymerTS.Base {
   hasfired: boolean;

   @Polymer.listen("base-called")
   onBaseCalled() {
      this.hasfired = true;
   }

   methodInBase()
   {
      return "this method is defined in BehaviorBaseTest";
   }
}

var PojoBehaviour1 =
{
   methodInPojo1: function()
   {
      return "pojo";
   }
};

var PojoBehaviour2 =
{
   methodInPojo2: function()
   {
      return "pojo";
   }
};


@Polymer.component("behavior-test1")
@Polymer.template("")
@Polymer.behavior(BehaviorBaseTest)
@Polymer.behavior(PojoBehaviour1)
export class BehaviorTest1 extends PolymerTS.Base
{
   @Polymer.property() bar="mybar";
   @Polymer.property() hasfired=false;

   @Polymer.behavior(PojoBehaviour2)

   attached()
   {
      this.fire("base-called");
   }

   methodInBase: ()=> void;

   methodInPojo1: ()=> string;
   methodInPojo2: ()=> string;

   methodInChild()
   {
      return this.methodInBase();
   }
}

BehaviorTest1.register();

@Polymer.component("behavior-test2")
@Polymer.template("")
export class BehaviorTest2 extends PolymerTS.Base {
   @Polymer.property() bar="mybar";
   @Polymer.property() hasfired=false;
   @Polymer.behavior(BehaviorBaseTest)

   attached() {
      this.fire("base-called");
   }

   methodInBase: ()=> void;

   methodInChild()
   {
      return this.methodInBase();
   }
}

BehaviorTest2.register();


@Polymer.component("template-test")

@Polymer.template("<div>this element is made from a template<div id='inner'>inner text</div></div>")

@Polymer.style
(`
   :host { display: block; }
   div { color: red; }
   #inner { width: 50px; }
`)

export class TemplateTest extends PolymerTS.Base
{
   @Polymer.property() bar="mybar";
}

TemplateTest.register();

@Polymer.component("host-attributes-test")

@Polymer.template("<div>testing host attributes</div>")

@Polymer.hostAttributes({ style: "color: red;" })

export class HostAttributesTest extends PolymerTS.Base
{
   @Polymer.property() bar="mybar";
}

HostAttributesTest.register();



@Polymer.component("base-element-test")
@Polymer.template("")
export class BaseElementTest extends PolymerTS.Base
{
   @Polymer.property() prop="mybar";

   attached()
   {
      this.prop = "A";
   }

   doSomething: ()=> string;

   doSomethingElse()
   {
      return "1";
   }
}

class DoSomethingClass
{
   doSomething()
   {
      return "C";
   }
}

export class ExtendedElementTestIntermediate extends BaseElementTest
{
   doSomethingIntermediate()
   {
      return "2";
   }
}

@Polymer.component("extended-element-test")
export class ExtendedElementTest extends ExtendedElementTestIntermediate
{
   @Polymer.property() bar="mybar";

   @Polymer.property() pmix="";
   @Polymer.property() qmix="";

   attached() {
      super.attached();
      this.prop+="B";
      this.pmix = this.doSomething();
      this.qmix = this.doSomethingElse()+this.doSomethingIntermediate();
   }
}

applyMixins(ExtendedElementTest, [DoSomethingClass]);

ExtendedElementTest.register();

function applyMixins(derivedCtor: any, baseCtors: any[]) {
   baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
         derivedCtor.prototype[name]=baseCtor.prototype[name];
      })
   });
}

