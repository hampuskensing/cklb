import path = require('path');
import App = require('./app');

let args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Fatal exit [reason: wrong number of parameters sent to cklb]');
  console.log(
    'Example call:\n' +
    'node main.js <path-to-layout> <path-to-switch-specification> <unitSize> ?<preview>\n');
  process.exit(1);
}

let cwd = process.cwd();
let layoutFilePath: string = path.join(cwd, args[0]);
let switchFilePath: string = path.join(cwd, args[1]);
let unitSize: number = parseInt(args[2], 10);
let preview: boolean = false;
if (args[3]) {
  preview = true;
}

let app: App = new App();
app.run(layoutFilePath, switchFilePath, unitSize, preview).then((result: string) => {
  console.log(result);
});
