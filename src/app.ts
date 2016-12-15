import JsonFileReader = require('./json-file-reader');
import path = require('path');

class App {

  jsonReader: JsonFileReader = new JsonFileReader();
  readonly PIXEL_TO_MM_RATIO: number = 72/19.05;

  run(layoutFileName: string, switchFileName: string, unitSize: number): Promise<string> {
    let readLayoutFilePromise = this.jsonReader.readJsonFile(layoutFileName);
    let readSwitchFilePromise = this.jsonReader.readJsonFile(switchFileName);

    let promises = [readLayoutFilePromise, readSwitchFilePromise];

    return Promise.all(promises).then((jsons: any[]) => {
      return this.createLayoutSvg(jsons[0], jsons[1], unitSize);
    });
  }

  createLayoutSvg(layout: { legend: string, units?: number }[][], switchSpecification: any, unitSize: number) {
    let svgString =  `<svg xmlns="http://www.w3.org/2000/svg" width="260mm" height="80mm">\n`;

    for (let i = 0; i < layout.length; i++) {
      let row = layout[i];
      svgString += `  <g transform="translate(0, ${(unitSize*i) * this.PIXEL_TO_MM_RATIO})">\n`;
      let currentTopX = 0;
      for (let j = 0; j < row.length; j++) {
        let key = row[j];
        svgString += `    <g name="${key.legend}" transform="translate(${currentTopX}, 0)">\n`;
        svgString += this.createSwitchHoles(key, unitSize, switchSpecification);
        svgString += `    </g>\n`;
        currentTopX += (key.units || 1) * unitSize * this.PIXEL_TO_MM_RATIO;
      }
      svgString += `  </g>\n`;
    }
    svgString += '</svg>';
    return svgString;
  }

  createSwitchHoles(key: { units?: number }, unitSize: number, switchJson: any): string {
    let result = '';
    let holeTypes = switchJson.switchHoles;
    let switchWidth = switchJson.width;
    let switchHeight = switchJson.height;
    for (let i = 0; i < holeTypes.length; i++) {
      let holeType = holeTypes[i];
      for (let j = 0; j < holeType.holes.length; j++) {
        let unit = key.units || 1;
        let hole = holeType.holes[j];
        result += `      <circle r="${holeType.diameter/2}mm"` +
                          ` cx="${((unit * unitSize) / 2) - (switchWidth/2) + hole.x}mm"` +
                          ` cy="${(unitSize / 2) - (switchHeight/2) + hole.y}mm" fill="#bbbbbb"/>\n`
      }
    }
    return result;
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
