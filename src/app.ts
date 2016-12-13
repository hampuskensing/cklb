import LayoutFileReader = require('./layout-file-reader');

let layoutReader = new LayoutFileReader();
let promise = layoutReader.readLayoutFile('../layouts/cklb-default-layout.json');
promise.then(console.dir);
