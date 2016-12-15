import builder = require('xmlbuilder');
import XMLElementOrXMLNode = require('xmlbuilder');

class LayoutBuilder {

  readonly PIXEL_TO_MM_RATIO: number = 72/19.05;

  createLayout(layout: { legend: string, units?: number }[][], switchSpecification: any, unitSize: number) {
    let svg = builder.create('svg')
      .att('xmlns', 'http://www.w3.org/2000/svg')
      .att('width', '260mm')
      .att('height', '80mm');

    for (let i = 0; i < layout.length; i++) {
      let row = layout[i];
      let switchRowEle = (<any>builder).begin()
        .ele('g', { transform: `translate(0, ${(unitSize*i) * this.PIXEL_TO_MM_RATIO})` });
      let currentTopX = 0;
      for (let j = 0; j < row.length; j++) {
        let key = row[j];
        let switchHolesEle = this.createSwitch(key, currentTopX, unitSize, switchSpecification);

        (<any>switchRowEle).importDocument(switchHolesEle);
        currentTopX += (key.units || 1) * unitSize * this.PIXEL_TO_MM_RATIO;
      }
      (<any>svg).importDocument(switchRowEle);
    }
    svg.end({ pretty: true });
    return svg.toString();
  }

  createSwitch(key: { units?: number, legend: string }, currentTopX: number, unitSize: number, switchJson: any): any {
    let switchHolesEle = (<any>builder).begin().ele('g')
      .att('legend', key.legend)
      .att('transform', `translate(${currentTopX}, 0)`);
    let holeTypes = switchJson.switchHoles;
    let switchWidth = switchJson.width;
    let switchHeight = switchJson.height;
    for (let i = 0; i < holeTypes.length; i++) {
      let holeType = holeTypes[i];
      for (let j = 0; j < holeType.holes.length; j++) {
        let unit = key.units || 1;
        let hole = holeType.holes[j];
        let switchHoleEle = builder.create('circle')
          .att('r', `${holeType.diameter/2}mm`)
          .att('cx', `${((unit * unitSize) / 2) - (switchWidth/2) + hole.x}mm`)
          .att('cy', `${(unitSize / 2) - (switchHeight/2) + hole.y}mm`)
          .att('fill', '#bbbbbb')
        switchHolesEle.importDocument(switchHoleEle);
      }
    }
    return switchHolesEle;
  }

}

export = LayoutBuilder;
