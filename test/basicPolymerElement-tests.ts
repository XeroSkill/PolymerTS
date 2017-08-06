describe(`<sample-control>`, () => {

    let container: HTMLElement;
    let control: HTMLElement;

    beforeEach((done) => {
        console.log(`setup`);
        container = document.createElement(`div`);
        control = document.createElement(`my-app`);
        container.appendChild(control);

        document.body.appendChild(container);
        setTimeout(done, 0);
    });

    afterEach(()=>{
        console.log(`tear-down`);
        document.body.removeChild(container)
    });

    it(`control registration`, (done => {
        console.log(`running a test :D`);
        expect(control).toBeTruthy();
        let controlMask = <any>control;

        //Basic property checks, as well as method checks.
        //Was having grief getting the methods working with the tester.. may have been a sleep thing.
        expect(controlMask.showPage404).toBeTruthy();
        expect(controlMask.page).toBe(`test-page`);
        expect(controlMask.user).toBe(`Tim`);

        controlMask.showPage404();
        expect(controlMask.page).toBe(`view404`);

        done();
    }))
});