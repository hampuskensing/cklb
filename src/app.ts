import JsonFileReader = require('./json-file-reader');
import LayoutBuilder = require('./layout-builder');

class App {

  jsonReader: JsonFileReader = new JsonFileReader();
  layoutBuilder: LayoutBuilder = new LayoutBuilder();

  run(layoutFileName: string, switchFileName: string, unitSize: number, preview?: boolean): Promise<string> {
    let readLayoutFilePromise = this.jsonReader.readJsonFile(layoutFileName);
    let readSwitchFilePromise = this.jsonReader.readJsonFile(switchFileName);

    let promises = [readLayoutFilePromise, readSwitchFilePromise];

    return Promise.all(promises).then((jsons: any[]) => {
      return this.layoutBuilder.createLayout(jsons[0], jsons[1], unitSize, preview);
    });
  }
}

export = App;
