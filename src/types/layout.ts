interface KeySwitch {
  legend: string;
  units?: number; // If not provided, 1 will be assumed
}

type Layout = KeySwitch[][];

export = Layout;
