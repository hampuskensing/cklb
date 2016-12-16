import builder = require('xmlbuilder');
import XMLElementOrXMLNode = require('xmlbuilder');
import SwitchSpecification = require('./types/switch-specification');
import Layout = require('./types/layout');

class LayoutBuilder {

  readonly PIXEL_TO_MM_RATIO: number = 72/19.05; // Not used
  drillGroups: { [diameter: string]: any[] } = {};

  createLayout(layout: Layout, switchSpecification: SwitchSpecification, unitSize: number) {
    for (let drillLayer of switchSpecification.drillLayers) {
      let groupName = drillLayer.diameter + '';
      let group = (<any>builder).begin().ele('g', { diameter: groupName, type: 'drillLayer' });
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

    let svg = builder.create('svg')
      .att('xmlns', 'http://www.w3.org/2000/svg')
      .att('width', '300mm')
      .att('height', '100mm');

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
    let drillLayers = switchJson.drillLayers;
    let switchWidth = switchJson.width;
    let switchHeight = switchJson.height;
    for (let i = 0; i < drillLayers.length; i++) {
      let drillLayer = drillLayers[i];
      for (let j = 0; j < drillLayer.holes.length; j++) {
        let unit = key.units || 1;
        let hole = drillLayer.holes[j];
        let cx = Math.round((((unit * unitSize) / 2) - (switchWidth/2) + hole.x + currentTopX)*100)/100;
        let cy = Math.round(((unitSize / 2) - (switchHeight/2) + hole.y + currentTopY)*100)/100;
        let switchHoleEle = builder.create('circle')
          .att('r', `${drillLayer.diameter/2}mm`)
          .att('cx', `${cx}mm`)
          .att('cy', `${cy}mm`)
          .att('fill', '#bbbbbb')
          .att('for', key.legend);
        (<any>this.drillGroups[drillLayer.diameter + '']).importDocument(switchHoleEle);
      }
    }
  }
}

export = LayoutBuilder;
