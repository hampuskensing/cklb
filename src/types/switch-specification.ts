interface Hole {
  x: number;
  y: number;
}

interface DrillLayer {
  diameter: number;
  holes: Hole[]; // Hole positions should be calculated from the top left corner of switch
}

interface SwitchSpecification {
  name: string;
  width: number;
  height: number;
  drillLayers: DrillLayer[]
}

export = SwitchSpecification;
