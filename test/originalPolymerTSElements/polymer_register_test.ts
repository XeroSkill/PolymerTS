/// <amd-module name="test/originalPolymerTSElements/polymer_register_tests"/>
import * as Polymer from "../../src/polymerTS/polymerTSDecorators";

@Polymer.component('test-element')
export class TestElement extends polymer.Base
{
      
}

TestElement.register();


@Polymer.component('test-input1', 'input')
export class TestInput1 extends polymer.Base
{

}

TestInput1.register();

@Polymer.component('test-input2')
@Polymer.extend('input')
export class TestInput2 extends polymer.Base
{

}

TestInput2.register();
