import builder = require('xmlbuilder');
import SwitchSpecification = require('./types/switch-specification');
import Layout = require('./types/layout');

class LayoutBuilder {

  readonly PIXEL_TO_MM_RATIO: number = 72/19.05; // Not used
  drillGroups: { [diameter: string]: any[] } = {};
  keyCapGroup: any;

  createLayout(layout: Layout, switchSpecification: SwitchSpecification, unitSize: number, preview?: boolean) {
    for (let drillLayer of switchSpecification.drillLayers) {
      let diameter = drillLayer.diameter + '';
      let group = (<any>builder).begin().ele('g', { diameter: diameter, type: drillLayer.type });
      this.drillGroups[diameter+drillLayer.type] = group;
    }
    this.keyCapGroup = (<any>builder).begin().ele('g', { type: 'keyCaps' });
    let currentTopY = 0;
    for (let i = 0; i < layout.length; i++) {
      let row = layout[i];
      let currentTopX = 0;
      for (let j = 0; j < row.length; j++) {
        let key = row[j];
        if (preview) {
          this.createAndAppendKeyCap(key, currentTopX, currentTopY, unitSize);
        } else {
          this.createAndAppendDrillHoles(key, currentTopX, currentTopY, unitSize, switchSpecification);
        }
        currentTopX += (key.units || 1) * unitSize;
      }
      currentTopY += unitSize;
    }

    let svg = builder.create('svg')
      .att('xmlns', 'http://www.w3.org/2000/svg')
      .att('width', '300mm')
      .att('height', '100mm');

    (<any>svg).importDocument(this.keyCapGroup);

    for (let group in this.drillGroups) {
      if (this.drillGroups.hasOwnProperty(group)) {
        (<any>svg).importDocument(this.drillGroups[group]);
      }
    }


    return svg.end({ pretty: true });
  }

  createAndAppendKeyCap(key: { units?: number, legend: string, lower: string, raise: string, color: string, type?: string },
                        currentTopX: number,
                        currentTopY: number,
                        unitSize: number): void {
    if (key.type === 'spacer') {
      return;
    }
    this.keyCapGroup.ele('rect')
      .att('id', key.legend)
      .att('x', currentTopX+'mm')
      .att('y', currentTopY+'mm')
      .att('width', ((key.units || 1) * unitSize)+'mm')
      .att('height', unitSize+'mm')
      .att('rx', 15)
      .att('ry', 15)
      .att('fill', key.color ? key.color : '#ccccb3')
      .att('stroke', '#b8b894');
    this.keyCapGroup.ele('text', key.legend)
      .att('x', 2+currentTopX+'mm')
      .att('y', 5+currentTopY+'mm')
      .att('font-size', 20);
    this.keyCapGroup.ele('text', key.lower)
      .att('fill', '#40a4f7')
      .att('x', 2+currentTopX+'mm')
      .att('y', 11+currentTopY+'mm')
      .att('font-size', 20);
    this.keyCapGroup.ele('text', key.raise)
      .att('fill', '#f74058')
      .att('x', 2+currentTopX+'mm')
      .att('y', 17+currentTopY+'mm')
      .att('font-size', 20);
  }

  createAndAppendDrillHoles(key: { units?: number, legend: string, type?: string },
                            currentTopX: number,
                            currentTopY: number,
                            unitSize: number,
                            switchJson: any): void {
    if (key.type === 'spacer') {
      return;
    }
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
          .att('fill', drillLayer.type === 'connector' ? '#e69900' : '#000000')
          .att('for', key.legend);
        (<any>this.drillGroups[drillLayer.diameter + drillLayer.type]).importDocument(switchHoleEle);
      }
    }
  }
}

export = LayoutBuilder;
