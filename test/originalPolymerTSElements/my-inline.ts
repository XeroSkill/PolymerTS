﻿/// <amd-module name="test/originalPolymerTSElements/my-inline"/>
import * as Polymer from "../../src/polymerTS/polymerTSDecorators";

export class MyAbstract extends PolymerTS.Base {
   makeSomeNoise() {
      console.log("argh!");
      this.fire("noise-made");
   }
}

@Polymer.component("my-inline")

@Polymer.template
(`
   <div>
      This element has been created completely from code
      <br>The prop is: <span>{{prop}}</span>
      <br>And the marker is <span>{{marker}}</span>
   </div>
`)

@Polymer.style
(`
   :host { 
      display: block; 
   } 

   div { 
      color: red; 
   }
`)

export class MyInline extends MyAbstract implements MyMixin
{
   @Polymer.property() public prop   = "hello world";
   @Polymer.property() public marker = "default marker";
   
   //is = "my-inline"; 

   private myprivate = [1,2,3,4,5];

   constructor(marker: string)
   {
      super();            
      console.log(`constructor("${marker}")`);
      this.prop = "hello world and all the rest";
      //console.log(this.myprivate);      

      if(marker!==undefined) this.marker = marker;
   }
   
   /*
   factoryImpl(foo, bar)
   {
      console.log(`factoryImpl called with foo=${foo} bar=${bar}`);
   }   
   */

   created()
   {
      //this.prop = "hello";
      console.log("created()");
      /*console.log(this.myprivate);      */
   }

   ready()
   {
      console.log("ready()");
      /*
      console.log(this.myprivate);

      if (this.myprivate[0] == 1) console.log("correct value preserved");
      else console.log("correct value NOT preserved");

      this.myprivate[0] = 5;

      this.makeSomeNoise();

      this.prop = "64"; */

      this.makeSomeNoise();
   }

   attached()
   {
      console.log("attached()");
   }

   @Polymer.observe("prop")
   hiChanged(newVal, oldVal)
   {
      console.log(`prop changed from ${oldVal} to ${newVal}`);
   }

   noiseMade: ()=>void;
}

export class MyMixin extends PolymerTS.Base
{
   @Polymer.listen("noise-made")
   noiseMade() {
      console.log("someone made noise!");
   }
}

/*
function applyMixins(derivedCtor: any, baseCtors: any[]) {
   baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
         derivedCtor.prototype[name] = baseCtor.prototype[name];
      })
   });
}

applyMixins(MyInline, [MyMixin]);
*/