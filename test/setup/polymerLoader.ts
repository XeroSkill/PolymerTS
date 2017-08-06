//TODO - Add a check to see if a poly fill is needed SEE polymer-starter-kit

// 1. Load Polymer before any code touches the DOM
let script = <any>document.createElement(`script`);
script.src = `/base/bower_components/webcomponentsjs/webcomponents.js`;
document.getElementsByTagName("head")[0].appendChild(script);

//2 Load the components

let importTestElements = (path: string) => {
    let link = <any>document.createElement(`link`);
    link.rel = `import`;
    link.href = path;
    document.getElementsByTagName(`head`)[0].appendChild(link);
};

//2.a - Load Simple Tests Elements First
importTestElements(`/base/test/elements/elements.html`);

//2.b - Load original polymer TS test elements
importTestElements(`/base/test/originalPolymerTSElements/testFixture.html`);


// Delay Jasmine specs until WebComponentsReady
let POLYMER_READY = false;
beforeEach((done) => {
    window.addEventListener(`WebComponentsReady`, () => {
        POLYMER_READY = true;
        console.log(`polymer-loaded`);
        done();
    });
    if(POLYMER_READY) {
        `polymer-loader-check`;
        done();
    }
});
