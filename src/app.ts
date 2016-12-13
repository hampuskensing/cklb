import LayoutFileReader = require('./layout-file-reader');

console.log('hoho');
let layoutReader = new LayoutFileReader();
layoutReader.readLayoutFile('../layouts/cklb-default-layout.json');
