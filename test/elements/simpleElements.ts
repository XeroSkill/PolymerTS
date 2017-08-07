/// <amd-module name="test/elements/simpleElements"/>

export const SIMPLE_CONTROL_TAG = `simple-control-ts`;

@component(SIMPLE_CONTROL_TAG)
export class SimpleControlTS extends polymer.Base {

    @property({
        type: String,
        reflectToAttribute: true,
        value: "test-page"
    })
    public page: string;


    @property({
        type: String,
        value: "Tim"
    })
    public user: string;

    public showPage404() {
        this.page = `view404`;
    }

    @observe(`page`)
    public onPageChange(pageValue: string) {
        console.log(`page has changed`);
    }
}

SimpleControlTS.register();
