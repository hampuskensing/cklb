import LayoutFileReader = require('./layout-file-reader');

let layoutReader = new LayoutFileReader();
let promise = layoutReader.readLayoutFile('../layouts/cklb-default-layout.json');
promise.then((keyboard: any) => {
  keyboard.layout.forEach((keys: { legend: string, units?: number }[]) => {
    console.log(keys.map(key => key.units || 1).reduce((a, b) => a + b) * keyboard.meta.unitSize);
  });
});
