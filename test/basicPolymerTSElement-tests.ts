/// <amd-module name="test/basicPolymerTSElement-tests"/>

import {SimpleControlTS, SIMPLE_CONTROL_TAG} from "./elements/simpleElements"

describe(`<simple-control-ts>`, ()=> {
    let container: HTMLElement;
    let control: SimpleControlTS;
    let originalTimeout: number;
    console.log(`starting test`);

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        container = document.createElement(`div`);
        control = <any>document.createElement(SIMPLE_CONTROL_TAG);
        container.appendChild(control);

        document.body.appendChild(container);
        setTimeout(done, 0);
    });

    afterEach(()=>{
        console.log(`tear-down`);
        document.body.removeChild(container);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it(`Polymer TS registration`, (done => {
        console.log(`running a test :D`);

        //Basic property checks, as well as method checks.
        //Was having grief getting the methods working with the tester.. may have been a sleep thing.
        expect(control.showPage404).toBeTruthy();
        expect(control.page).toBe(`test-page`);
        expect(control.user).toBe(`Tim`);

        control.showPage404();
        expect(control.page).toBe(`view404`);

        done();
    }))
});