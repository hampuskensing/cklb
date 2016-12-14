import JsonFileReader = require('./json-file-reader');

class App {

  jsonReader: JsonFileReader = new JsonFileReader();
  layoutJson: any;
  switchJson: any;
  readonly PIXEL_TO_MM_RATIO: number = 72/19.05;

  run() {
    this.readLayoutFile()
      .then(this.readSwitchFile.bind(this))
      .then(this.createLayoutSvg.bind(this));
  }

  readLayoutFile(): Promise<any> {
    return this.jsonReader.readJsonFile('../layouts/cklb-default-layout.json')
      .then(layoutJson => this.layoutJson = layoutJson);
  }

  readSwitchFile(): Promise<any> {
    return this.jsonReader.readJsonFile('../switches/cherry-ml.json')
      .then(switchJson => this.switchJson = switchJson);
  }

  createLayoutSvg() {
    let layout: { legend: string, units?: number }[][] = this.layoutJson.layout;
    let unitSize: number = this.layoutJson.meta.unitSize;

    let svgString =  `<svg xmlns="http://www.w3.org/2000/svg" width="260mm" height="80mm">\n`;

    for (let i = 0; i < layout.length; i++) {
      let row = layout[i];
      svgString += `  <g transform="translate(0, ${(unitSize*i) * this.PIXEL_TO_MM_RATIO})">\n`;
      let currentTopX = 0;
      for (let j = 0; j < row.length; j++) {
        let key = row[j];
        svgString += `    <g name="${key.legend}" transform="translate(${currentTopX}, 0)">\n`;
        svgString += this.createSwitchHoles(key);
        svgString += `    </g>\n`;
        currentTopX += (key.units || 1) * unitSize * this.PIXEL_TO_MM_RATIO;
      }
      svgString += `  </g>\n`;
    }
    svgString += '</svg>';
    console.log(svgString);
  }

  createSwitchHoles(key: { units?: number }): string {
    let unitSize: number = this.layoutJson.meta.unitSize;
    let result = '';
    let holeTypes = this.switchJson.switchHoles;
    let switchWidth = this.switchJson.width;
    let switchHeight = this.switchJson.height;
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

let app = new App();
app.run();
