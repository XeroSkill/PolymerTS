/// <amd-module name="test/elements/simpleElements"/>

import * as Polymer from "../../src/polymerTS/polymerTSDecorators";

export const SIMPLE_CONTROL_TAG = `simple-control-ts`;

@Polymer.component(SIMPLE_CONTROL_TAG)
export class SimpleControlTS extends polymer.Base {

    @Polymer.property({
        type: String,
        reflectToAttribute: true,
        value: "test-page"
    })
    public page: string;


    @Polymer.property({
        type: String,
        value: "Tim"
    })
    public user: string;

    public showPage404() {
        this.page = `view404`;
    }

    @Polymer.observe(`page`)
    public onPageChange(pageValue: string) {
        console.log(`page has changed`);
    }
}

SimpleControlTS.register();
