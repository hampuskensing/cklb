# cklb - The Custom Keyboard Layout Builder

clkb generates a keyboard layout from a simple JSON input file. 
The output is a keyboard preview file in SVG as well as a drill hole guide in SVG for the switches chosen.
The output files could then be input to any CAM software to generate GCode for a CNC. 

## JSON file format
### Layout
The layout file is an array of a keyswitch array.
```TypeScript
interface KeySwitch {
  legend: string;
  units?: number; // If not provided, 1 will be assumed
}

type Layout = KeySwitch[][];

let exampleLayout = [
  [{ legend: 'Q' }, { legend: 'W' }, { legend: 'E' }],
  [{ legend: 'shift', units: 1.5 }, { legend: 'cmd', units: 1.5 }],
];
```
### Switch
```TypeScript
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

let exampleKeySwitch = {
  "name": "Cherry ML",
  "width": 12,
  "height": 11.4,
  "drillLayers": [
    { "diameter": 1.4, "holes": [{ "x": 0.92, "y": 1.27 },{ "x": 6, "y": 1.27 },{ "x": 11.08, "y": 1.27 } ]},
    { "diameter": 1.5, "holes": [{ "x": 0.92, "y": 5.08 },{ "x": 6, "y": 10.16 },{ "x": 11.08, "y": 5.08 } ]},
    { "diameter": 2.6, "holes": [{ "x": 6, "y": 5.08 }]}
  ]
}
```
## Run
### Install
#### Prepare source
Download and run npm install.
#### Compile source
```bash
> ./node_modules/.bin/tsc
```
### Run
```bash
> node ./build/main.js ./layouts/cklb-default-layout.json ./switches/cherry-ml.json 19 > output.svg
```
First parameter is the layout, second parameter is the switch specification and the third parameter is the unit
size in millimeters. The switch will be centered in one unit. Recommended unit size is 19.05mm as that is what
Cherry uses, minimum unit size is around 16mm.
