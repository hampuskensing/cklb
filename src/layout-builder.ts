import builder = require('xmlbuilder');
import XMLElementOrXMLNode = require('xmlbuilder');

class LayoutBuilder {

  readonly PIXEL_TO_MM_RATIO: number = 72/19.05;
  drillGroups: { [diameter: string]: any[] } = {};

  createLayout(layout: { legend: string, units?: number }[][], switchSpecification: any, unitSize: number) {
    let svg = builder.create('svg')
      .att('xmlns', 'http://www.w3.org/2000/svg')
      .att('width', '260mm')
      .att('height', '80mm');

    for (let holeType of switchSpecification.switchHoles) {
      let groupName = holeType.diameter + '';
      let group = (<any>builder).begin().ele('g', { name: groupName });
      this.drillGroups[groupName] = group;
    }

    let currentTopY = 0;
    for (let i = 0; i < layout.length; i++) {
      let row = layout[i];
      let currentTopX = 0;
      for (let j = 0; j < row.length; j++) {
        let key = row[j];
        this.createAndAppendDrillHoles(key, currentTopX, currentTopY, unitSize, switchSpecification);
        currentTopX += (key.units || 1) * unitSize;
      }
      currentTopY += unitSize;
    }

    for (let group in this.drillGroups) {
      if (this.drillGroups.hasOwnProperty(group)) {
        (<any>svg).importDocument(this.drillGroups[group]);
      }
    }

    return svg.end({ pretty: true });
  }

  createAndAppendDrillHoles(key: { units?: number, legend: string },
                            currentTopX: number,
                            currentTopY: number,
                            unitSize: number,
                            switchJson: any): any {
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
          .att('cx', `${((unit * unitSize) / 2) - (switchWidth/2) + hole.x + currentTopX}mm`)
          .att('cy', `${(unitSize / 2) - (switchHeight/2) + hole.y + currentTopY}mm`)
          .att('fill', '#bbbbbb');
        (<any>this.drillGroups[holeType.diameter + '']).importDocument(switchHoleEle);
      }
    }
  }
}

export = LayoutBuilder;
