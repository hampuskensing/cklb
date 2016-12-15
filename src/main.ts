import path = require('path');
import App = require('./app');

let args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Fatal exit [reason: wrong number of parameters sent to cklb]');
  console.log(
    'Example call:\n' +
    'node main.js <path-to-layout> <path-to-switch-specification> <unitSize>\n');
  process.exit(1);
}

let cwd = process.cwd();
let layoutFilePath = path.join(cwd, args[0]);
let switchFilePath = path.join(cwd, args[1]);
let unitSize = parseInt(args[2], 10);

let app: App = new App();
app.run(layoutFilePath, switchFilePath, unitSize).then((result: string) => {
  console.log(result);
});
