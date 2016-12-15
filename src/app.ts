import path = require('path');
import JsonFileReader = require('./json-file-reader');
import LayoutBuilder = require('./layout-builder');


class App {

  jsonReader: JsonFileReader = new JsonFileReader();
  layoutBuilder: LayoutBuilder = new LayoutBuilder();

  run(layoutFileName: string, switchFileName: string, unitSize: number): Promise<string> {
    let readLayoutFilePromise = this.jsonReader.readJsonFile(layoutFileName);
    let readSwitchFilePromise = this.jsonReader.readJsonFile(switchFileName);

    let promises = [readLayoutFilePromise, readSwitchFilePromise];

    return Promise.all(promises).then((jsons: any[]) => {
      return this.layoutBuilder.createLayout(jsons[0], jsons[1], unitSize);
    });
  }
}

let args = process.argv.slice(2);
if (args.length !== 3) {
  console.error("Wrong number of parameters sent to cklb");
  process.exit(1);
}

let cwd = process.cwd();
let layoutFilePath = path.join(cwd, args[0]);
let switchFilePath = path.join(cwd, args[1]);
let unitSize = parseInt(args[2], 10);

let app = new App();
app.run(layoutFilePath, switchFilePath, unitSize).then((result: string) => {
  console.log(result);
});
