interface KeySwitch {
  legend: string;
  lower: string;
  raise: string;
  color: string;
  units?: number; // If not provided, 1 will be assumed
  type?: 'spacer' | 'key'
}

type Layout = KeySwitch[][];

export = Layout;
