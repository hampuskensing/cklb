import path = require('path');
import App = require('./app');

let args = process.argv.slice(2);
if (args.length !== 3) {
  console.error("Wrong number of parameters sent to cklb");
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
