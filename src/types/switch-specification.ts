interface Hole {
  x: number;
  y: number;
}

interface DrillLayer {
  diameter: number;
  type: string;
  holes: Hole[]; // Hole positions should be calculated from the top left corner of switch
}

interface SwitchSpecification {
  name: string;
  width: number;
  height: number;
  drillLayers: DrillLayer[]
}

export = SwitchSpecification;
